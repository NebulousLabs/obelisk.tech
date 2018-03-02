import axios from 'axios'
import _ from 'lodash'
import React, { Component } from 'react'
import { validate } from 'email-validator'

import { formatBTC, formatDollars, formatNumber } from './utils'

import Countries from './countries'
const US = require('us')

const unitPrice = 1849
const shipDate = 'September 14, 2018'
const productName = 'DCR1'
const termsFilename = 'terms_dcr1_batch3.pdf'

const MS_PER_SEC = 1000
const MS_PER_MIN = MS_PER_SEC * 60
const MS_PER_HOUR = MS_PER_MIN * 60
const MS_PER_DAY = MS_PER_HOUR * 24

let isOnBTCAddressPage = false
window.onbeforeunload = function(e) {
  const msg =
    'The Bitcoin address for this order will not be emailed to you, so' +
    'please make sure you do not navigate away from this page without sending payment.'

  if (isOnBTCAddressPage) {
    e.returnValue = msg
    return msg
  }
  return undefined
}

class PageOne extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      newsletter: false,
      email: '',
      backupemail: '',
      backupphone: '',
      quantity: 1,

      error: '',
    }
  }

  render() {
    if (!this.props.visible) {
      return <div />
    }
    const leftPad = amount => {
      const pad = '000'
      return pad.substring(0, pad.length - amount.length) + amount
    }
    const handleNameChange = e => this.setState({ name: e.target.value })
    const handleEmailChange = e => this.setState({ email: e.target.value })
    const handleBackupPhoneChange = e => this.setState({ backupphone: e.target.value })
    const handleBackupEmailChange = e => this.setState({ backupemail: e.target.value })
    const handleQuantityChange = e => {
      if (parseInt(e.target.value, 10) < 999) {
        this.setState({ quantity: parseInt(e.target.value, 10) })
      }
    }
    const decrementQuantity = () => {
      if (this.state.quantity > 1) {
        this.setState({ quantity: this.state.quantity - 1 })
      }
    }
    const incrementQuantity = () => {
      if (this.state.quantity < 999) {
        this.setState({ quantity: this.state.quantity + 1 })
      }
    }
    const handleNextClick = () => {
      if (this.state.name === '' || this.state.email === '') {
        this.setState({ error: 'name and email are required.' })
        return
      }
      if (this.state.quantity === 0) {
        this.setState({ error: 'quantity must be greater than zero' })
        return
      }
      if (!validate(this.state.email)) {
        this.setState({ error: 'invalid email address provided' })
        return
      }
      this.props.next(this.state)
    }
    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="http://support.obelisk.tech" target="_blank">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img className="obelisk-header" src="assets/img/obelisk-text.png" alt="obelisk logo" />
            <div className="separator" />
            <div className="order-form">
              <h3> {this.props.step + 1}. YOUR ORDER </h3>
              <input
                value={this.state.name}
                onChange={handleNameChange}
                type="text"
                className="form-control"
                placeholder="Full Name"
              />
              <input
                value={this.state.email}
                onChange={handleEmailChange}
                type="text"
                className="form-control"
                placeholder="Email"
              />
              <input
                value={this.state.backupemail}
                onChange={handleBackupEmailChange}
                type="text"
                className="form-control"
                placeholder="Backup Email (optional)"
              />
              <input
                value={this.state.backupphone}
                onChange={handleBackupPhoneChange}
                type="text"
                className="form-control"
                placeholder="Backup Phone (optional)"
              />
              <p className="input-error">{this.state.error}</p>
            </div>
            <div className="red-separator" />
            <div className="separator" />
            <div className="promotional-emails">
              <p> Would you like to receive promotional emails from us? </p>
              <input
                checked={this.state.newsletter}
                onChange={() => this.setState({ newsletter: !this.state.newsletter })}
                type="checkbox"
              />
            </div>
          </div>
          <div className="col-md-1" />
          <div className="col-md-3 visible-md-block visible-lg-block">
            <img
              className="hardware-shot"
              src="assets/img/hardware-shot.png"
              alt="obelisk hardware"
            />
          </div>
          <div className="col-md-4 quantity-section">
            <h3> How many Obelisk {productName}s would you like to purchase? </h3>
            <div className="quantity-form">
              <button onClick={decrementQuantity} className="minus-button" />
              <input
                onChange={handleQuantityChange}
                value={leftPad(this.state.quantity.toString())}
              />
              <button onClick={incrementQuantity} className="plus-button" />
            </div>
            <div className="quantity-price">{formatDollars(unitPrice * this.state.quantity)}</div>
            <div className="shipping-note">
              *orders are estimated to ship on or before {shipDate}.
            </div>
            <div className="next-button" onClick={handleNextClick} />
          </div>
        </div>
      </div>
    )
  }
}

class ShippingForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addr1: '',
      addr2: '',
      city: '',
      region: '',
      postal: '',
      country: '',

      error: '',
    }
  }
  render() {
    if (!this.props.visible) {
      return <div />
    }
    // const isEurope = country => {
    //   if (!countries.hasOwnProperty(country)) {
    //     return false
    //   }
    //   return countries[country].continent === 'EU'
    // }
    const estimatedCost = () => {
      let shippingCost = 80
      // if (
      //   this.state.country === 'US' ||
      //   isEurope(this.state.country) ||
      //   this.state.country === 'CN'
      // ) {
      //   shippingCost = 35
      // }
      let tax = 0
      if (this.state.country === 'US' && this.state.region.toLowerCase() === 'ma') {
        tax = unitPrice * 0.0625
      }
      return parseFloat(((shippingCost + tax) * this.props.quantity).toFixed(2))
    }
    const handleAddr1Change = e => this.setState({ addr1: e.target.value })
    const handleAddr2Change = e => this.setState({ addr2: e.target.value })
    const handleCityChange = e => this.setState({ city: e.target.value })
    const handleStateChange = e => this.setState({ region: e.target.value })
    const handlePostalChange = e => this.setState({ postal: e.target.value })
    const handleCountryChange = e => this.setState({ country: e.target.value })
    const handleNextClick = () => {
      if (this.state.addr1 === '') {
        this.setState({ error: 'address must not be empty' })
        return
      }
      if (this.state.city === '') {
        this.setState({ error: 'city must not be empty' })
        return
      }
      if (this.state.region === '') {
        this.setState({ error: 'region must not be empty' })
        return
      }
      if (this.state.postal === '') {
        this.setState({ error: 'postal code must not be empty' })
        return
      }
      if (this.state.country === '') {
        this.setState({ error: 'please select a country' })
        return
      }
      this.props.next({
        address: `${this.state.addr1}\n${this.state.addr2}\n${this.state.city}\n${
          this.state.region
        }\n${this.state.postal}\n${this.state.country}`,
        shippingCost: estimatedCost(),
      })
    }

    const countryOptions = _.map(Countries, countryInfo => (
      <option value={countryInfo.code2} key={countryInfo.code2}>
        {countryInfo.name}
      </option>
    ))
    countryOptions.unshift(
      <option value="" key="country">
        Country...
      </option>,
    )

    const stateOptions = _.map(US.states, state => {
      return <option value={state.abbr}>{state.name}</option>
    })
    stateOptions.unshift(<option value="">State...</option>)

    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="http://support.obelisk.tech" target="_blank">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img className="obelisk-header" src="assets/img/obelisk-text.png" alt="obelisk logo" />
            <div className="separator" />
            <div className="order-form">
              <h3> {this.props.step + 1}. SHIPPING </h3>
              <select value={this.state.country} onChange={handleCountryChange} name="Country">
                {countryOptions}
              </select>
              <input
                type="text"
                value={this.state.addr1}
                onChange={handleAddr1Change}
                className="form-control"
                placeholder="Address Line 1"
              />
              <input
                type="text"
                value={this.state.addr2}
                onChange={handleAddr2Change}
                className="form-control"
                placeholder="Address Line 2"
              />
              <input
                type="text"
                value={this.state.city}
                onChange={handleCityChange}
                className="form-control"
                placeholder="City"
              />
              <div className="statezip">
                {this.state.country === 'US' ? (
                  <select
                    className="state-select"
                    value={this.state.region}
                    onChange={handleStateChange}
                    name="State"
                  >
                    {stateOptions}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={this.state.region}
                    onChange={handleStateChange}
                    className="form-control"
                    placeholder="State/Region"
                  />
                )}
                <input
                  type="text"
                  value={this.state.postal}
                  onChange={handlePostalChange}
                  className="form-control"
                  placeholder="ZIP/Postal Code"
                />
              </div>
            </div>
            <p className="input-error">{this.state.error}</p>
            <div onClick={this.props.back} className="back-button" />
            <div className="red-separator" />
            <div className="separator" />
          </div>
          <div className="col-md-1" />
          <div className="col-md-3 visible-md-block visible-lg-block">
            <img
              className="hardware-shot"
              src="assets/img/hardware-shot.png"
              alt="obelisk hardware"
            />
          </div>
          <div className="col-md-4 cost-section">
            <h3> Estimated sales tax and shipping costs </h3>
            <div className="estimated-cost">
              <span className="money">$</span>
              <p className="amount">{formatNumber(estimatedCost())}</p>
            </div>
            <p className="note">
              * Shipping costs are $80 per unit. Orders will ship on or before {shipDate}.
            </p>
            <div className="next-button" onClick={handleNextClick} />
          </div>
        </div>
      </div>
    )
  }
}

class CouponEntry extends Component {
  constructor(props) {
    super(props)
    this.state = { code: props.coupon.code || '' }
  }

  handleChange = e => {
    const code = e.target.value.trim().toUpperCase()
    // Only allow valid characters
    switch (code.length) {
      case 0:
        break

      case 1:
        if (code !== 'O') {
          return
        }
        break
      case 2:
        if (code !== 'O-') {
          return
        }
        break

      default:
        if (code.length > 14) {
          return
        } else if (!/^O-[0-9ABCDEF]{1,12}$/.test(code)) {
          return
        }
        break
    }

    this.setState({ code })
  }

  // Return true if valid and false if not
  validateCouponCodeFormat = () => {
    if (this.state.code.length === 0) {
      return true
    }

    let error
    if (!/^[800-]*O-[0-9ABCDEF]{12}$/.test(this.state.code)) {
      error = "Invalid code.  Must start with 'O-', followed by 12 numbers/letters."
    }
    this.props.updateCouponAtIndex(
      {
        code: this.state.code,
        isValid: null,
        isValidationInProgress: false,
        value: 0,
        unitsUsed: 0,
        unitsAvailable: 0,
        error,
      },
      this.props.index,
    )
    return !error
  }

  handleBlur = e => {
    this.props.updateCouponAtIndex(
      {
        code: this.state.code,
        isValid: null,
        isValidationInProgress: false,
        value: 0,
        unitsUsed: 0,
        unitsAvailable: 0,
        error: undefined,
      },
      this.props.index,
    )

    if (this.validateCouponCodeFormat()) {
      // Hack to ensure state is updated before we send server request
      setTimeout(() => this.props.onValidate(this.state.code, this.props.index), 0)
    }
  }

  handleDeleteCoupon = () => {
    this.props.removeCouponAtIndex(this.props.index)
  }

  render() {
    const { isValid, isValidationInProgress, error, unitsUsed, value } = this.props.coupon

    let icon = undefined
    if (isValidationInProgress) {
      icon = <img className="coupon-spinner" src="assets/img/spinner.gif" alt="spinner" />
    } else if (isValid === null) {
      icon = <div />
    } else if (isValid && error === '') {
      icon = <img className="coupon-icon" src="assets/img/checkmark.png" alt="valid coupon" />
    } else {
      icon = (
        <img className="coupon-icon" src="assets/img/red-error-icon.png" alt="invalid coupon" />
      )
    }

    return (
      <tr>
        <td className="coupon-col-center">
          <img
            className="coupon-delete-button"
            src="assets/img/red-x.png"
            alt="valid coupon"
            onClick={this.handleDeleteCoupon}
          />
        </td>
        <td className="coupon-col-left">
          <input
            className="coupon-input"
            type="text"
            placeholder="e.g., O-123456789012"
            value={this.state.code}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />
        </td>
        <td className="coupon-col-left">{icon}</td>
        <td className="coupon-col-right">
          {isValidationInProgress || !isValid ? (
            <div />
          ) : (
            <div className="coupon-label">
              {unitsUsed} x {formatDollars(value)}
            </div>
          )}
        </td>
        <td className="coupon-col-right">
          {isValidationInProgress || !isValid ? (
            <div />
          ) : (
            <div className="coupon-value">-{formatDollars(unitsUsed * value)}</div>
          )}
        </td>
      </tr>
    )
  }
}

class RedeemCoupons extends Component {
  handleNextClick = () => {
    // NOTE: We no longer prevent the user from moving forward even if there
    //       are errors in some coupons.  Those coupons are just ignored.
    this.props.next({})
  }

  render() {
    const { visible, coupons, totalPrice, quantity } = this.props
    if (!visible) {
      return <div />
    }

    const couponEntries = []
    for (let index = 0; index < coupons.length; index++) {
      const coupon = coupons[index]
      couponEntries.push(
        <CouponEntry
          coupon={coupon}
          index={index}
          key={coupon.code + index}
          onValidate={this.props.validateCouponAtIndex}
          updateCouponAtIndex={this.props.updateCouponAtIndex}
          removeCouponAtIndex={this.props.removeCouponAtIndex}
        />,
      )

      if (coupon.error) {
        couponEntries.push(
          <tr key={coupon.code + index + '_error'}>
            <td colSpan="5">
              <div className="coupon-error">{coupon.error}</div>
            </td>
          </tr>,
        )
      }
      if (coupon.note) {
        couponEntries.push(
          <tr key={coupon.code + index + '_note'}>
            <td colSpan="5">
              <div className="coupon-note">{coupon.note}</div>
            </td>
          </tr>,
        )
      }
    }

    const totalCouponValue = _.reduce(
      coupons,
      (total, coupon) => total + coupon.unitsUsed * coupon.value,
      0,
    )

    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="http://support.obelisk.tech" target="_blank">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
            <div className="separator" />
            <div className="coupons-container">
              <h3>{this.props.step + 1}. SUBTOTAL</h3>
              <div className="coupon-subtotal-container">
                <div className="coupon-subheading">
                  {formatNumber(quantity)} x {productName}
                </div>
                <div className="coupon-subtotal">{formatDollars(totalPrice)}</div>
              </div>
              <div className="coupon-subheading">COUPONS</div>
              <div className="coupon-list">
                <table className="coupon-table">
                  <colgroup>
                    <col width="5%" />
                    <col width="40%" />
                    <col width="5%" />
                    <col width="25%" />
                    <col width="25%" />
                  </colgroup>
                  <tbody>{couponEntries}</tbody>
                </table>
              </div>
              <div className="coupon-total-container">
                <div className="coupon-subheading">SUBTOTAL AFTER COUPONS</div>
                <div className="coupon-subtotal">
                  {formatDollars(totalPrice - totalCouponValue)}
                </div>
              </div>
              <div className="coupon-error">{this.props.error}</div>
              <div className="add-coupon-button" onClick={this.props.addCoupon}>
                ADD COUPON
              </div>
            </div>
            <div onClick={this.props.back} className="back-button" />
            <div className="red-separator" />
            <div className="separator" />
          </div>
          <div className="col-md-1" />
          <div className="col-md-3 visible-md-block visible-lg-block">
            <img alt="hardware" className="hardware-shot" src="assets/img/hardware-shot.png" />
          </div>
          <div className="col-md-4 cost-section">
            <h3>Subtotal</h3>
            <div className="estimated-cost">
              <span className="money">$</span>
              <p className="amount">{formatNumber(totalPrice - totalCouponValue)}</p>
            </div>
            <p className="note">
              * Note that the coupons you enter will be reserved for this order once submitted on
              the next page.
            </p>
            <div className="next-button" onClick={this.handleNextClick} />
          </div>
        </div>
      </div>
    )
  }
}

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paymentMethod: 'bitcoin',
      checked: false,
      ackPaymentTime: false,
      error: '',
    }
  }
  render() {
    if (!this.props.visible) {
      return <div />
    }
    const handleNextClick = () => {
      if (!this.state.checked) {
        this.setState({ error: 'You must agree to the terms and conditions before continuing' })
        return
      }
      if (this.state.paymentMethod === 'bitcoin' && !this.state.ackPaymentTime) {
        this.setState({ error: 'You must acknowledge the payment time limit before continuing' })
        return
      }
      if (this.state.paymentMethod === '') {
        this.setState({ error: 'You must select a payment method' })
        return
      }
      if (this.props.btcUsd === 0) {
        this.setState({
          error: 'Unable to get current Bitcoin price. Try to checkout again later.',
        })
        return
      }
      this.setState({ error: '' })
      this.props.next(this.state)
    }
    const handleBitcoinClick = () => this.setState({ paymentMethod: 'bitcoin' })
    const handleTransferClick = () => {
      alert('Due to fraudulent activity, wire transfers are currently unavailable.')
      // this.setState({ paymentMethod: 'transfer' })
    }

    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="http://support.obelisk.tech" target="_blank">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
            <div className="separator" />
            <div className="checkout order-form">
              <h3>{this.props.step + 1}. CHECKOUT </h3>
              <p> Payment is accepted in Bitcoin.</p>
              <div className="estimated-costs">
                <div className="estimated-cost">
                  <span className="money">
                    <img src="assets/img/bitcoin-logo.png" alt="bitcoin logo" />
                  </span>
                  <p className="amount">{formatBTC(this.props.btcPrice)}</p>
                </div>
                <p> or </p>
                <div className="estimated-cost">
                  <span className="money">$</span>
                  <p className="amount">{formatNumber(this.props.totalPrice)}</p>
                </div>
              </div>
              <div onClick={this.props.back} className="back-button" />
              <div className="red-separator" />
              <div className="separator" />
            </div>
          </div>
          <div className="col-md-1" />
          <div className="col-md-3 visible-md-block visible-lg-block">
            <img alt="logo" className="hardware-shot" src="assets/img/hardware-shot.png" />
          </div>
          <div className="col-md-4 final-cost-section">
            <h3> Payment Method </h3>
            <div className="payment-forms">
              <div
                onClick={handleBitcoinClick}
                className={
                  this.state.paymentMethod === 'bitcoin' ? 'payment-form selected' : 'payment-form'
                }
              >
                <img src="assets/img/bitcoin-logo.png" alt="bitcoin logo" />
                <p> Bitcoin </p>
              </div>
            </div>
            {this.state.paymentMethod === 'bitcoin' ? (
              <div className="terms-check">
                <p>
                  By checking this box, you acknowledge that payment must be made within 8 hours.
                </p>
                <input
                  checked={this.state.ackPaymentTime}
                  onChange={() => this.setState({ ackPaymentTime: !this.state.ackPaymentTime })}
                  type="checkbox"
                  name="terms-check"
                />
              </div>
            ) : (
              undefined
            )}
            <div className="terms-check">
              <p>
                By checking this box, you agree to the{' '}
                <a href={`/assets/img/${termsFilename}`} target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>{' '}
                and acknowledge the{' '}
                <a href="/assets/img/privacypolicy.pdf" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </p>
              <input
                checked={this.state.checked}
                onChange={() => this.setState({ checked: !this.state.checked })}
                type="checkbox"
                name="terms-check"
              />
            </div>
            <div className="input-error">{this.props.checkoutError}</div>
            <div className="input-error">{this.state.error}</div>
            <div className="next-button" onClick={handleNextClick} />
          </div>
        </div>
      </div>
    )
  }
}

class Payment extends Component {
  constructor(props) {
    super(props)

    // Look up the payment expiration time in local storage.  Set it if it doesn't exist.
    let paymentExpirationTimeStr = localStorage.getItem('Obelisk: ' + this.props.uid)
    let paymentExpirationTime
    if (!paymentExpirationTimeStr) {
      const currTime = new Date()
      paymentExpirationTime = currTime.getTime() + 8 * MS_PER_HOUR
      localStorage.setItem('Obelisk: ' + this.props.uid, `${paymentExpirationTime}`)
    } else {
      paymentExpirationTime = parseInt(paymentExpirationTimeStr, 10)
    }

    this.state = {
      refundAddress: '',
      error: '',
      interval: setInterval(this.updatePaymentTimer, 1000),
      isPaymentTimerExpired: false,
      paymentExpirationTime,
      hoursRemaining: '00',
      minsRemaining: '00',
      secsRemaining: '00',
    }

    if (this.props.paymentMethod === 'bitcoin') {
      isOnBTCAddressPage = true
    }

    setTimeout(this.updatePaymentTimer, 0)
  }

  // Payment timer
  updatePaymentTimer = () => {
    const currTime = new Date()
    let timeRemaining = this.state.paymentExpirationTime - currTime.getTime()
    if (timeRemaining <= 0) {
      clearInterval(this.state.interval)
      this.setState({
        hoursRemaining: '00',
        minsRemaining: '00',
        secsRemaining: '00',
        isPaymentTimerExpired: true,
      })

      return
    }

    const days = Math.floor(timeRemaining / MS_PER_DAY)
    timeRemaining -= days * MS_PER_DAY

    const hours = Math.floor(timeRemaining / MS_PER_HOUR)
    timeRemaining -= hours * MS_PER_HOUR

    const mins = Math.floor(timeRemaining / MS_PER_MIN)
    timeRemaining -= mins * MS_PER_MIN

    const secs = Math.floor(timeRemaining / MS_PER_SEC)

    const hoursRemaining = hours < 10 ? '0' + hours : hours
    const minsRemaining = mins < 10 ? '0' + mins : mins
    const secsRemaining = secs < 10 ? '0' + secs : secs
    this.setState({ hoursRemaining, minsRemaining, secsRemaining })
  }

  render() {
    let { paymentMethod, btcaddr, btcPrice, visible, uid } = this.props

    if (!visible) {
      return <div />
    }

    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="http://support.obelisk.tech" target="_blank">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
            <div className="separator" />
            {paymentMethod === 'bitcoin' ? (
              <div className="payment order-form">
                <h3>{this.props.step + 1}. PAYMENT </h3>
                {!this.state.isPaymentTimerExpired ? (
                  <div>
                    <p className="paywith">Pay with Bitcoin</p>
                    <div className="payinfo">
                      <img
                        alt="qrcode"
                        className="qrcode"
                        src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=bitcoin:${btcaddr}?amount=${btcPrice}`}
                      />
                      <div className="payaddr">
                        <p>
                          Use the QR code or send{' '}
                          <div className="price">{formatBTC(btcPrice)} BTC </div>to the address
                          below:
                        </p>
                        <br />
                        <p>Deposit Address:</p>
                        <p className="addr">{btcaddr}</p>
                      </div>
                    </div>
                    <div className="payment-timer-container">
                      <div className="payment-note">
                        <span>NOTE:</span> The Bitcoin address above will not be emailed to you, so
                        please make sure you do not navigate away from this page without sending
                        payment.
                      </div>
                      <div>Time Remaining To Submit Bitcoin Payment</div>
                      <table>
                        <tbody>
                          <tr>
                            <td className="countdown-timer red-gradient-text countdown-hh">
                              {this.state.hoursRemaining}
                            </td>
                            <td className="countdown-timer red-gradient-text countdown-mm">
                              {this.state.minsRemaining}
                            </td>
                            <td className="countdown-timer red-gradient-text countdown-ss">
                              {this.state.secsRemaining}
                            </td>
                          </tr>
                          <tr>
                            <td className="countdown-label">HH</td>
                            <td className="countdown-label">MM</td>
                            <td className="countdown-label">SS</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="expiration-message">
                      The payment window for this order has ended. If you have already sent your
                      payment, then you will receive a confirmation email once the payment has been
                      confirmed.
                    </p>
                    <p className="expiration-message">
                      If you haven't sent payment yet, then this order is no longer valid, and you
                      will need to submit a new order.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="payment order-form">
                <h3> {this.props.step + 1}. PAYMENT </h3>
                <p className="paywith">Pay with Wire Transfer</p>
                <div className="payinfo">
                  <p className="transfer-instructions">
                    {' '}
                    Please download the{' '}
                    <a
                      href="/assets/img/wiretransfer.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      instructions
                    </a>{' '}
                    to complete your payment.
                  </p>
                </div>
              </div>
            )}
            <div className="red-separator" />
            <div className="separator" />
          </div>
          <div className="col-md-1" />
          <div className="col-md-3 visible-md-block visible-lg-block">
            <img alt="hardware-shot" className="hardware-shot" src="assets/img/hardware-shot.png" />
          </div>
          {!this.state.isPaymentTimerExpired ? (
            <div className="col-md-4 payment-selection-section">
              <p className="confirmation-thanks">
                Thank you! You will receive an order acknowledgement email shortly.
              </p>
              <div className="confirmation-info">
                <p>Your confirmation number is:</p>
                <h2 className="confirmation-number">{uid}</h2>
                <p className="keep-safe">
                  Keep your confirmation number safe and treat it as a password!
                </p>
              </div>
            </div>
          ) : (
            <div className="col-md-4 payment-selection-section">
              <p className="confirmation-thanks">
                NOTE: If you used any coupons in this order, they will remain locked to this order
                for 24 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      address: '',
      email: '',
      backupemail: '',
      backupphone: '',
      quantity: 1,
      shippingCost: 0,
      newsletter: false,
      btcUsd: 0,
      paymentMethod: 'bitcoin',

      uid: '',
      paymentAddr: '',

      step: 0,
      checkoutError: '',
      coupons: [
        {
          code: '',
          isValid: null,
          unitsUsed: 0,
          unitsAvailable: 0,
          value: 0,
          isValidationInProgress: false,
        },
      ],
      couponDiscount: 0,
    }
    axios
      .get('https://api.gemini.com/v1/pubticker/btcusd', { responseType: 'json' })
      .then(res => {
        this.setState({ btcUsd: parseFloat(res.data.last) })
      })
      .catch(() => {
        axios
          .get('https://api.gdax.com/products/BTC-USD/ticker', { responseType: 'json' })
          .then(res => {
            this.setState({ btcUsd: parseFloat(res.data.price) })
          })
      })
  }

  updateCouponDiscount = coupons => {
    const quantity = this.state.quantity
    let remaining = quantity
    coupons = _.orderBy(coupons, 'value', 'desc')

    this.checkForDuplicateCoupons(coupons)

    _.map(coupons, coupon => {
      if (coupon.code !== '') {
        if (coupon.unitsAvailable === 0) {
          coupon.isValid = false
          coupon.isValidationInProgress = false
          coupon.note = 'No remaining coupons.'
          coupon.unitsUsed = 0
        } else if (coupon.unitsAvailable > remaining) {
          const remainingCouponValue = coupon.unitsAvailable - remaining
          coupon.note =
            'Only one coupon can be applied per unit. Coupon has ' +
            remainingCouponValue +
            ' remaining use(s).'
          coupon.unitsUsed = remaining
          remaining = 0
        } else {
          coupon.unitsUsed = coupon.unitsAvailable
          coupon.note = undefined
          remaining -= coupon.unitsUsed
        }
      }

      return coupon
    })

    const couponDiscount = _.reduce(
      coupons,
      (total, coupon) => total + coupon.value * coupon.unitsUsed,
      0,
    )

    this.setState({ coupons, couponDiscount })
  }

  addCoupon = () => {
    const coupons = this.state.coupons.slice()
    coupons.push({
      code: '',
      isValidationInProgress: false,
      isValid: null,
      unitsUsed: 0,
      unitsAvailable: 0,
      value: 0,
    })
    this.updateCouponDiscount(coupons)
  }

  totalCouponsUsed = coupons => {
    let used = 0
    for (let i = 0; i < coupons.length; i++) {
      const coupon = coupons[i]
      used += coupon.isValid ? coupon.unitsUsed : 0
    }
    return used
  }

  checkForDuplicateCoupons(coupons) {
    for (let i = coupons.length - 1; i >= 0; i--) {
      const currCoupon = coupons[i]
      for (let j = i - 1; j >= 0; j--) {
        if (coupons[j].code.length > 0 && coupons[j].code === currCoupon.code) {
          currCoupon.isValidationInProgress = false
          currCoupon.isValid = false
          currCoupon.error = `This coupon is duplicated ${i < j ? 'below' : 'above'}`
        }
      }
    }
  }

  dedupeCouponCodes(coupons) {
    let dedupedCoupons = coupons.slice()
    for (let i = coupons.length - 1; i >= 0; i--) {
      const currCoupon = coupons[i]
      for (let j = i - 1; j >= 0; j--) {
        if (coupons[j].length > 0 && coupons[j] === currCoupon) {
          dedupedCoupons = dedupedCoupons.splice(j, 1)
        }
      }
    }
    return dedupedCoupons
  }

  updateCouponAtIndex = (coupon, index) => {
    const coupons = this.state.coupons.slice()
    coupons.splice(index, 1, { ...coupon })

    this.updateCouponDiscount(coupons)
  }

  removeCouponAtIndex = index => {
    const coupons = this.state.coupons.slice()
    coupons.splice(index, 1)
    this.updateCouponDiscount(coupons)
  }

  validateCouponAtIndex = (code, index) => {
    // Mark the coupon with isValidationInProgress = true
    const coupons = this.state.coupons.slice()
    const coupon = coupons[index]
    if (!coupon) {
      // TODO: Some error
      return
    }

    let couponCodes = _.map(this.state.coupons, coupon => coupon.code).filter(
      code => code.length > 0,
    )
    if (couponCodes.length === 0) {
      return
    }

    // Clear out the coupon so we don't show the details while validating with the server
    coupon.isValidationInProgress = true
    coupon.error = undefined
    coupon.code = code
    this.setState({ coupons })

    couponCodes = this.dedupeCouponCodes(couponCodes)

    // Replicate coupon code $800 coupons - temporary hack
    const expandedCouponCodes = _.filter(couponCodes, code => !_.startsWith(code, '800-')).reduce(
      (newCouponCodes, code) => {
        newCouponCodes.push('800-' + code)
        newCouponCodes.push(code)
        return newCouponCodes
      },
      [],
    )

    axios
      .get(`/validatecoupons?coupons=${expandedCouponCodes.join(',')}`, {
        timeout: 10000,
        responseType: 'json',
      })
      .then(res => {
        let coupons = res.data.map(respCoupon => {
          const coupon = {
            code: respCoupon.uniqueID,
            isValidationInProgress: false,
            value: parseInt(respCoupon.couponValue, 10),
            unitsUsed: parseInt(respCoupon.couponsReserved, 10),
            unitsAvailable: parseInt(respCoupon.couponsReserved, 10),
            error: respCoupon.error,
            isValid: respCoupon.isValid,
          }
          return coupon
        })

        this.updateCouponDiscount(coupons)
      })
      .catch(err => {
        console.log(err)
        // Timeout or other error
        let coupons = this.state.coupons.slice()
        coupons.splice(index, 1, {
          ...coupon,
          isValidationInProgress: false,
          isValid: false,
          error: 'Unable to reach server to validate coupon.  Please try again later.',
          value: 0,
          unitsUsed: 0,
          unitsAvailable: 0,
        })
        this.setState({
          coupons,
        })
      })
  }

  render() {
    const undiscountedPrice = unitPrice * this.state.quantity + this.state.shippingCost
    const totalPrice = undiscountedPrice - this.state.couponDiscount
    let btcPrice = totalPrice / this.state.btcUsd
    btcPrice = parseFloat(btcPrice.toFixed(5))
    const next = result => {
      this.setState(result)
      this.setState({ step: this.state.step + 1 })
    }
    const back = () => {
      this.setState({ checkoutError: '' })
      if (this.state.step > 0) {
        this.setState({ step: this.state.step - 1 })
      }
    }
    const handleSubmit = result => {
      this.setState(result)
      const formData = new FormData()
      formData.append('email', this.state.email)
      formData.append('newsletter', this.state.newsletter)
      formData.append('name', this.state.name)
      formData.append('address', this.state.address)
      formData.append('backupEmail', this.state.backupemail)
      formData.append('phone', this.state.backupphone)
      formData.append('units', this.state.quantity)
      formData.append(
        'price',
        (() => {
          if (result.paymentMethod === 'transfer') {
            return totalPrice
          }
          return btcPrice
        })(),
      )
      formData.append('wire', result.paymentMethod === 'transfer')
      formData.append('product', productName)

      // Add on the coupon info, including the discount, so we can double-check it
      const couponCodes = _.filter(
        this.state.coupons,
        coupon =>
          coupon.code.length > 0 &&
          (!coupon.error || coupon.error.length === 0) &&
          coupon.unitsUsed > 0,
      ).map(coupon => coupon.code + ':' + coupon.unitsUsed)

      formData.append('coupons', couponCodes.join(','))
      formData.append('couponDiscount', this.state.couponDiscount)

      axios
        .post(`/adduser`, formData, { responseType: 'json' })
        .then(res => {
          this.setState({ uid: res.data.uniqueID, paymentAddr: res.data.paymentAddr })
          this.setState({ step: this.state.step + 1 })
        })
        .catch(err => {
          // The email error is not currently checked on the server, and the "unknown" error
          // is effectively the same as the one below, so just commenting this out for now.
          //   if (res.data.includes('user with that email already exists')) {
          //     this.setState({
          //       checkoutError:
          //         `a user has already ordered an Obelisk ${productName} using that email. If you want to modify your order, contact hello@obelisk.tech.`,
          //     })
          //   } else {
          //     this.setState({
          //       checkoutError:
          //         'an unknown error has occurred and has been reported to the developers.',
          //     })
          //   }
          // }
          this.setState({
            checkoutError: `Could not check out. Try again in a few minutes. (${
              err ? err.message : 'Server error'
            })`,
          })
        })
    }
    return (
      <div>
        <PageOne visible={this.state.step === 0} next={next} step={this.state.step} />
        <ShippingForm
          visible={this.state.step === 1}
          quantity={this.state.quantity}
          next={result => {
            // Update the coupon discount when returning to the coupons screen
            this.updateCouponDiscount(this.state.coupons)
            next(result)
          }}
          back={back}
          step={this.state.step}
        />
        <RedeemCoupons
          visible={this.state.step === 2}
          quantity={this.state.quantity}
          totalPrice={undiscountedPrice}
          coupons={this.state.coupons}
          addCoupon={this.addCoupon}
          error={this.state.couponError}
          validateCouponAtIndex={this.validateCouponAtIndex}
          removeCouponAtIndex={this.removeCouponAtIndex}
          updateCouponAtIndex={this.updateCouponAtIndex}
          next={next}
          back={back}
          step={this.state.step}
        />
        <Checkout
          visible={this.state.step === 3}
          checkoutError={this.state.checkoutError}
          shippingCost={this.state.shippingCost}
          totalPrice={totalPrice}
          btcPrice={btcPrice}
          btcUsd={this.state.btcUsd}
          coupons={this.state.coupons}
          next={handleSubmit}
          back={back}
          step={this.state.step}
        />
        {this.state.step === 4 ? (
          <Payment
            visible={this.state.step === 4}
            paymentMethod={this.state.paymentMethod}
            uid={this.state.uid}
            btcaddr={this.state.paymentAddr}
            btcPrice={btcPrice}
            back={back}
            step={this.state.step}
          />
        ) : (
          undefined
        )}
      </div>
    )
  }
}

export default App
