import axios from 'axios'
import _ from 'lodash'
import React, { Component } from 'react'
import { validate } from 'email-validator'
import { countries } from 'countries-list'

import { formatBTC, formatDollars, formatNumber } from './utils'

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
          <a href="mailto:hello@obelisk.tech">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img className="obelisk-header" src="assets/img/obelisk-text.png" alt="obelisk logo" />
            <div className="separator" />
            <div className="order-form">
              <h3> 1. YOUR ORDER </h3>
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
            <h3> How many Obelisk DCR1s would you like to purchase? </h3>
            <div className="quantity-form">
              <button onClick={decrementQuantity} className="minus-button" />
              <input
                onChange={handleQuantityChange}
                value={leftPad(this.state.quantity.toString())}
              />
              <button onClick={incrementQuantity} className="plus-button" />
            </div>
            <div className="quantity-price">{formatDollars(2499 * this.state.quantity)}</div>
            <div className="shipping-note">*orders are estimated to ship by June, 2018.</div>
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
    const isEurope = country => {
      if (!countries.hasOwnProperty(country)) {
        return false
      }
      return countries[country].continent === 'EU'
    }
    const estimatedCost = () => {
      let baseCost = 70
      if (
        this.state.country === 'US' ||
        isEurope(this.state.country) ||
        this.state.country === 'CN'
      ) {
        baseCost = 35
      }
      let tax = 0
      if (this.state.country === 'US' && this.state.region.toLowerCase() === 'ma') {
        tax = 2499 * 0.0625
      }
      return parseFloat(((baseCost + tax) * this.props.quantity).toFixed(2))
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
        address: `${this.state.addr1}\n${this.state.addr2}\n${this.state.city}\n${this.state
          .region}\n${this.state.postal}\n${this.state.country}`,
        shippingCost: estimatedCost(),
      })
    }
    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="mailto:hello@obelisk.tech">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img className="obelisk-header" src="assets/img/obelisk-text.png" alt="obelisk logo" />
            <div className="separator" />
            <div className="order-form">
              <h3> 2. SHIPPING </h3>
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
                <input
                  type="text"
                  value={this.state.region}
                  onChange={handleStateChange}
                  className="form-control"
                  placeholder="State/Region"
                />
                <input
                  type="text"
                  value={this.state.postal}
                  onChange={handlePostalChange}
                  className="form-control"
                  placeholder="ZIP/Postal Code"
                />
              </div>
              <select value={this.state.country} onChange={handleCountryChange} name="Country">
                <option value="">Country...</option>
                <option value="AF">Afghanistan</option>
                <option value="AL">Albania</option>
                <option value="DZ">Algeria</option>
                <option value="AS">American Samoa</option>
                <option value="AD">Andorra</option>
                <option value="AG">Angola</option>
                <option value="AI">Anguilla</option>
                <option value="AG">Antigua &amp; Barbuda</option>
                <option value="AR">Argentina</option>
                <option value="AA">Armenia</option>
                <option value="AW">Aruba</option>
                <option value="AU">Australia</option>
                <option value="AT">Austria</option>
                <option value="AZ">Azerbaijan</option>
                <option value="BS">Bahamas</option>
                <option value="BH">Bahrain</option>
                <option value="BD">Bangladesh</option>
                <option value="BB">Barbados</option>
                <option value="BY">Belarus</option>
                <option value="BE">Belgium</option>
                <option value="BZ">Belize</option>
                <option value="BJ">Benin</option>
                <option value="BM">Bermuda</option>
                <option value="BT">Bhutan</option>
                <option value="BO">Bolivia</option>
                <option value="BL">Bonaire</option>
                <option value="BA">Bosnia &amp; Herzegovina</option>
                <option value="BW">Botswana</option>
                <option value="BR">Brazil</option>
                <option value="BC">British Indian Ocean Ter</option>
                <option value="BN">Brunei</option>
                <option value="BG">Bulgaria</option>
                <option value="BF">Burkina Faso</option>
                <option value="BI">Burundi</option>
                <option value="KH">Cambodia</option>
                <option value="CM">Cameroon</option>
                <option value="CA">Canada</option>
                <option value="IC">Canary Islands</option>
                <option value="CV">Cape Verde</option>
                <option value="KY">Cayman Islands</option>
                <option value="CF">Central African Republic</option>
                <option value="TD">Chad</option>
                <option value="CD">Channel Islands</option>
                <option value="CL">Chile</option>
                <option value="CN">China</option>
                <option value="CI">Christmas Island</option>
                <option value="CS">Cocos Island</option>
                <option value="CO">Colombia</option>
                <option value="CC">Comoros</option>
                <option value="CG">Congo</option>
                <option value="CK">Cook Islands</option>
                <option value="CR">Costa Rica</option>
                <option value="CT">Cote D'Ivoire</option>
                <option value="HR">Croatia</option>
                <option value="CB">Curacao</option>
                <option value="CY">Cyprus</option>
                <option value="CZ">Czech Republic</option>
                <option value="DK">Denmark</option>
                <option value="DJ">Djibouti</option>
                <option value="DM">Dominica</option>
                <option value="DO">Dominican Republic</option>
                <option value="TM">East Timor</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egypt</option>
                <option value="SV">El Salvador</option>
                <option value="GQ">Equatorial Guinea</option>
                <option value="ER">Eritrea</option>
                <option value="EE">Estonia</option>
                <option value="ET">Ethiopia</option>
                <option value="FA">Falkland Islands</option>
                <option value="FO">Faroe Islands</option>
                <option value="FJ">Fiji</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="GF">French Guiana</option>
                <option value="PF">French Polynesia</option>
                <option value="FS">French Southern Ter</option>
                <option value="GA">Gabon</option>
                <option value="GM">Gambia</option>
                <option value="GE">Georgia</option>
                <option value="DE">Germany</option>
                <option value="GH">Ghana</option>
                <option value="GI">Gibraltar</option>
                <option value="GB">Great Britain</option>
                <option value="GR">Greece</option>
                <option value="GL">Greenland</option>
                <option value="GD">Grenada</option>
                <option value="GP">Guadeloupe</option>
                <option value="GU">Guam</option>
                <option value="GT">Guatemala</option>
                <option value="GN">Guinea</option>
                <option value="GY">Guyana</option>
                <option value="HT">Haiti</option>
                <option value="HW">Hawaii</option>
                <option value="HN">Honduras</option>
                <option value="HK">Hong Kong</option>
                <option value="HU">Hungary</option>
                <option value="IS">Iceland</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="IQ">Iraq</option>
                <option value="IR">Ireland</option>
                <option value="IM">Isle of Man</option>
                <option value="IL">Israel</option>
                <option value="IT">Italy</option>
                <option value="JM">Jamaica</option>
                <option value="JP">Japan</option>
                <option value="JO">Jordan</option>
                <option value="KZ">Kazakhstan</option>
                <option value="KE">Kenya</option>
                <option value="KI">Kiribati</option>
                <option value="KS">Korea South</option>
                <option value="XK">Kosovo, Republic Of</option>
                <option value="KW">Kuwait</option>
                <option value="KG">Kyrgyzstan</option>
                <option value="LA">Laos</option>
                <option value="LV">Latvia</option>
                <option value="LB">Lebanon</option>
                <option value="LS">Lesotho</option>
                <option value="LR">Liberia</option>
                <option value="LY">Libya</option>
                <option value="LI">Liechtenstein</option>
                <option value="LT">Lithuania</option>
                <option value="LU">Luxembourg</option>
                <option value="MO">Macau</option>
                <option value="MK">Macedonia</option>
                <option value="MG">Madagascar</option>
                <option value="MY">Malaysia</option>
                <option value="MW">Malawi</option>
                <option value="MV">Maldives</option>
                <option value="ML">Mali</option>
                <option value="MT">Malta</option>
                <option value="MH">Marshall Islands</option>
                <option value="MQ">Martinique</option>
                <option value="MR">Mauritania</option>
                <option value="MU">Mauritius</option>
                <option value="ME">Mayotte</option>
                <option value="MX">Mexico</option>
                <option value="MI">Midway Islands</option>
                <option value="MD">Moldova</option>
                <option value="MC">Monaco</option>
                <option value="MN">Mongolia</option>
                <option value="MS">Montserrat</option>
                <option value="MA">Morocco</option>
                <option value="MZ">Mozambique</option>
                <option value="MM">Myanmar</option>
                <option value="NA">Nambia</option>
                <option value="NU">Nauru</option>
                <option value="NP">Nepal</option>
                <option value="AN">Netherland Antilles</option>
                <option value="NL">Netherlands (Holland, Europe)</option>
                <option value="NV">Nevis</option>
                <option value="NC">New Caledonia</option>
                <option value="NZ">New Zealand</option>
                <option value="NI">Nicaragua</option>
                <option value="NE">Niger</option>
                <option value="NG">Nigeria</option>
                <option value="NW">Niue</option>
                <option value="NF">Norfolk Island</option>
                <option value="NO">Norway</option>
                <option value="OM">Oman</option>
                <option value="PK">Pakistan</option>
                <option value="PW">Palau Island</option>
                <option value="PS">Palestine</option>
                <option value="PA">Panama</option>
                <option value="PG">Papua New Guinea</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Peru</option>
                <option value="PH">Philippines</option>
                <option value="PO">Pitcairn Island</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="PR">Puerto Rico</option>
                <option value="QA">Qatar</option>
                <option value="ME">Republic of Montenegro</option>
                <option value="RS">Republic of Serbia</option>
                <option value="RE">Reunion</option>
                <option value="RO">Romania</option>
                <option value="RU">Russia</option>
                <option value="RW">Rwanda</option>
                <option value="NT">St Barthelemy</option>
                <option value="EU">St Eustatius</option>
                <option value="HE">St Helena</option>
                <option value="KN">St Kitts-Nevis</option>
                <option value="LC">St Lucia</option>
                <option value="MB">St Maarten</option>
                <option value="PM">St Pierre &amp; Miquelon</option>
                <option value="VC">St Vincent &amp; Grenadines</option>
                <option value="SP">Saipan</option>
                <option value="SO">Samoa</option>
                <option value="AS">Samoa American</option>
                <option value="SM">San Marino</option>
                <option value="ST">Sao Tome &amp; Principe</option>
                <option value="SA">Saudi Arabia</option>
                <option value="SN">Senegal</option>
                <option value="RS">Serbia</option>
                <option value="SC">Seychelles</option>
                <option value="SL">Sierra Leone</option>
                <option value="SG">Singapore</option>
                <option value="SK">Slovakia</option>
                <option value="SI">Slovenia</option>
                <option value="SB">Solomon Islands</option>
                <option value="OI">Somalia</option>
                <option value="ZA">South Africa</option>
                <option value="ES">Spain</option>
                <option value="LK">Sri Lanka</option>
                <option value="SR">Suriname</option>
                <option value="SZ">Swaziland</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="TA">Tahiti</option>
                <option value="TW">Taiwan</option>
                <option value="TJ">Tajikistan</option>
                <option value="TZ">Tanzania</option>
                <option value="TH">Thailand</option>
                <option value="TG">Togo</option>
                <option value="TK">Tokelau</option>
                <option value="TO">Tonga</option>
                <option value="TT">Trinidad &amp; Tobago</option>
                <option value="TN">Tunisia</option>
                <option value="TR">Turkey</option>
                <option value="TU">Turkmenistan</option>
                <option value="TC">Turks &amp; Caicos Is</option>
                <option value="TV">Tuvalu</option>
                <option value="UG">Uganda</option>
                <option value="UA">Ukraine</option>
                <option value="AE">United Arab Emirates</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States of America</option>
                <option value="UY">Uruguay</option>
                <option value="UZ">Uzbekistan</option>
                <option value="VU">Vanuatu</option>
                <option value="VS">Vatican City State</option>
                <option value="VE">Venezuela</option>
                <option value="VN">Vietnam</option>
                <option value="VB">Virgin Islands (Brit)</option>
                <option value="VA">Virgin Islands (USA)</option>
                <option value="WK">Wake Island</option>
                <option value="WF">Wallis &amp; Futana Is</option>
                <option value="YE">Yemen</option>
                <option value="ZR">Zaire</option>
                <option value="ZM">Zambia</option>
                <option value="ZW">Zimbabwe</option>
              </select>
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
              * Shipping costs are $35 per unit for US/Europe/China Customers and $70 per unit for
              anywhere else. Orders will ship on or before June 30, 2018.
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
    if (!/^O-[0-9ABCDEF]{12}$/.test(this.state.code)) {
      error = "Invalid code.  Must start with 'O-', followed by 12 numbers/letters."
    }
    this.props.updateCouponAtIndex(
      {
        code: this.state.code,
        isValid: null,
        isValidationInProgress: false,
        value: 0,
        unitsUsed: 0,
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
    const { isValid, isValidationInProgress, unitsUsed, value } = this.props.coupon

    let icon = undefined
    if (isValidationInProgress) {
      icon = <img className="coupon-spinner" src="assets/img/spinner.gif" alt="spinner" />
    } else if (isValid === null) {
      icon = <div />
    } else if (isValid) {
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
    const anyErrors = _.some(this.props.coupons, 'error')
    if (anyErrors || this.props.error) {
      // Don't allow user to move to next step if there are errors.
      return
    }

    this.props.next(this.state)
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
    }

    const totalCouponValue = _.reduce(
      coupons,
      (total, coupon) => total + coupon.unitsUsed * coupon.value,
      0,
    )

    const totalNumCoupons = _.reduce(coupons, (total, coupon) => total + coupon.unitsUsed, 0)

    let addButton
    if (quantity > totalNumCoupons) {
      addButton = (
        <div className="add-coupon-button" onClick={this.props.addCoupon}>
          ADD COUPON
        </div>
      )
    }

    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="mailto:hello@obelisk.tech">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
            <div className="separator" />
            <div className="coupons-container">
              <h3>3. SUBTOTAL</h3>
              <div className="coupon-subtotal-container">
                <div className="coupon-subheading">{formatNumber(quantity)} x DCR1</div>
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
              {addButton}
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
              * Note that the coupons you entered will be reserved for this order once submitted on
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
      paymentMethod: '',
      checked: false,

      error: '',
    }
  }
  render() {
    if (!this.props.visible) {
      return <div />
    }
    const handleNextClick = () => {
      if (!this.state.checked) {
        this.setState({ error: 'you must agree to the terms and conditions before continuing' })
        return
      }
      if (this.state.paymentMethod === '') {
        this.setState({ error: 'you must select a payment method' })
        return
      }
      this.setState({ error: '' })
      this.props.next(this.state)
    }
    const handleBitcoinClick = () => this.setState({ paymentMethod: 'bitcoin' })
    const handleTransferClick = () => this.setState({ paymentMethod: 'transfer' })
    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="mailto:hello@obelisk.tech">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
            <div className="separator" />
            <div className="checkout order-form">
              <h3> 3. CHECKOUT </h3>
              <p> Payment is accepted in both Bitcoin or USD.</p>
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
              <p className="note">
                * If the Bitcoin exchange rate fluctuates by more than 5% before we can convert to
                USD, we will email you requesting additional payment in Bitcoin. We are using Gemini
                to exchange your coins as fast as possible.
              </p>
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
            <h3> Select a form of payment before proceeding to the next step. </h3>
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
              <div
                onClick={handleTransferClick}
                className={
                  this.state.paymentMethod === 'transfer' ? 'payment-form selected' : 'payment-form'
                }
              >
                <img src="assets/img/dollar-logo.png" alt="dollar symbol" />
                <p> Bank Wire </p>
              </div>
            </div>
            <div className="terms-check">
              <p>
                By checking this box, you agree to the{' '}
                <a href="/assets/img/terms.pdf" target="_blank" rel="noopener noreferrer">
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
    this.state = {
      refundAddress: '',

      error: '',
    }
  }
  render() {
    if (!this.props.visible) {
      return <div />
    }
    return (
      <div className="container main order-main">
        <div className="need-help">
          <p>Need Help?</p>
          <a href="mailto:hello@obelisk.tech">Contact us</a>
          <div className="separator-muted" />
        </div>
        <div className="row">
          <div className="col-md-4 order-section">
            <img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
            <div className="separator" />
            {this.props.paymentMethod === 'bitcoin' ? (
              <div className="payment order-form">
                <h3> 4. PAYMENT </h3>
                <p className="paywith">Pay with Bitcoin</p>
                <div className="payinfo">
                  <img
                    alt="qrcode"
                    className="qrcode"
                    src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=bitcoin:${this
                      .props.btcaddr}?amount=${this.props.btcPrice}`}
                  />
                  <div className="payaddr">
                    <p>
                      Use the QR code or send{' '}
                      <div className="price">{formatBTC(this.props.btcPrice)} BTC </div>to the
                      address below:
                    </p>
                    <br />
                    <p>Deposit Address</p>
                    <p className="addr">{this.props.btcaddr}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="payment order-form">
                <h3> 4. PAYMENT </h3>
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
          <div className="col-md-4 payment-selection-section">
            <p className="confirmation-thanks">
              Thank you! You will receive a confirmation email shortly.
            </p>
            <div className="confirmation-info">
              <p>Your confirmation number is:</p>
              <h2 className="confirmation-number">{this.props.uid}</h2>
              <p className="keep-safe">
                Keep that reference number safe and treat it as a password!
              </p>
            </div>
          </div>
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
      btcUsd: 2400,
      paymentMethod: '',

      uid: '',
      paymentAddr: '',

      step: 0,
      checkoutError: '',
      coupons: [
        {
          code: '',
          isValid: null,
          unitsUsed: 0,
          value: 0,
          isValidationInProgress: false,
        },
      ],
      couponDiscount: 0,
    }
    axios
      .get('https://api.gdax.com/products/BTC-USD/ticker', { responseType: 'json' })
      .then(res => {
        this.setState({ btcUsd: parseFloat(res.data.price) })
      })
    axios
      .get('https://api.gdax.com/products/ETH-USD/ticker', { responseType: 'json' })
      .then(res => {
        this.setState({ ethUsd: parseFloat(res.data.price) })
      })
  }

  updateCouponDiscount = coupons => {
    const couponDiscount = _.reduce(
      coupons,
      (total, coupon) => total + coupon.value * coupon.unitsUsed,
      0,
    )
    this.setState({ couponDiscount })
  }

  addCoupon = () => {
    const coupons = this.state.coupons.slice()
    coupons.push({ code: '', isValidationInProgress: false, isValid: null, unitsUsed: 0, value: 0 })
    this.setState({ coupons })
    this.updateCouponDiscount(coupons)
  }

  checkCouponRestrictions(quantityOrdered, coupons) {
    // Check that this coupon is not a duplicate of any other
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

    // Ensure count of coupons used doesn't exceed units purchased
    let totalCouponsUsed = 0
    for (let i = 0; i < coupons.length; i++) {
      const coupon = coupons[i]
      totalCouponsUsed += coupon.isValid ? coupon.unitsUsed : 0
    }

    if (totalCouponsUsed > quantityOrdered) {
      this.setState({
        couponError: 'You can use at most one coupon per unit.  Remove some coupons.',
      })
      return
    }
  }

  updateCouponAtIndex = (coupon, index) => {
    const coupons = this.state.coupons.slice()
    coupons.splice(index, 1, { ...coupon })

    this.checkCouponRestrictions(this.state.quantity, coupons)

    this.setState({ coupons })
    this.updateCouponDiscount(coupons)
  }

  removeCouponAtIndex = index => {
    const coupons = this.state.coupons.slice()
    coupons.splice(index, 1)
    this.setState({ coupons })
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

    const couponCodes = _.map(this.state.coupons, coupon => coupon.code).filter(
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

    axios
      .get(`/validatecoupons?coupons=${couponCodes.join(',')}&q=${this.state.quantity}`, {
        timeout: 10000,
        responseType: 'json',
      })
      .then(res => {
        const coupons = _.map(res.data, respCoupon => {
          const coupon = {
            code: respCoupon.uniqueID,
            isValidationInProgress: false,
            value: parseInt(respCoupon.couponValue, 10),
            unitsUsed: parseInt(respCoupon.couponsReserved, 10),
            error: respCoupon.error,
            isValid: respCoupon.isValid,
          }
          return coupon
        })

        this.setState({ coupons })
        this.updateCouponDiscount(coupons)
      })
      .catch(err => {
        // Timeout or other error
        let coupons = this.state.coupons.slice()
        coupons.splice(index, 1, {
          ...coupon,
          isValidationInProgress: false,
          isValid: false,
          error: 'Unable to reach server to validate coupon.  Please try again later.',
          value: 0,
          unitsUsed: 0,
        })
        this.setState({
          coupons,
        })
      })
  }

  render() {
    const undiscountedPrice = 2499 * this.state.quantity + this.state.shippingCost
    const totalPrice = undiscountedPrice - this.state.couponDiscount
    const undiscountedBtcPrice = undiscountedPrice / this.state.btcUsd
    const btcPrice = totalPrice / this.state.btcUsd
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
      // We send the undiscounted price here, as the coupon is applied on the server side
      formData.append(
        'price',
        (() => {
          if (result.paymentMethod === 'transfer') {
            return undiscountedPrice
          }
          return formatBTC(undiscountedBtcPrice)
        })(),
      )
      formData.append('wire', result.paymentMethod === 'transfer')
      formData.append('product', 'DCR1')

      // Add on the coupon info, including the discount, so we can double-check it
      const couponCodes = _.map(this.state.coupons, coupon => coupon.code).filter(
        code => code.length > 0,
      )

      formData.append('coupons', couponCodes.join(','))
      formData.append('couponDiscount', this.state.couponDiscount)

      axios
        .post(`/adduser`, formData, { responseType: 'json' })
        .then(res => {
          this.setState({ uid: res.data.uniqueID, paymentAddr: res.data.paymentAddr })
          this.setState({ step: 4 })
        })
        .catch(err => {
          // The email error is not currently checked on the server, and the "unknown" error
          // is effectively the same as the one below, so just commenting this out for now.
          //   if (res.data.includes('user with that email already exists')) {
          //     this.setState({
          //       checkoutError:
          //         'a user has already ordered an Obelisk DCR1 using that email. If you want to modify your order, contact hello@obelisk.tech.',
          //     })
          //   } else {
          //     this.setState({
          //       checkoutError:
          //         'an unknown error has occurred and has been reported to the developers.',
          //     })
          //   }
          // }
          this.setState({ checkoutError: 'could not check out. try again in a few minutes.' })
        })
    }
    return (
      <div>
        <PageOne visible={this.state.step === 0} next={next} />
        <ShippingForm
          visible={this.state.step === 1}
          quantity={this.state.quantity}
          next={next}
          back={back}
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
        />
        <Checkout
          visible={this.state.step === 3}
          checkoutError={this.state.checkoutError}
          shippingCost={this.state.shippingCost}
          totalPrice={totalPrice}
          btcPrice={btcPrice}
          coupons={this.state.coupons}
          next={handleSubmit}
          back={back}
        />
        <Payment
          visible={this.state.step === 4}
          paymentMethod={this.state.paymentMethod}
          uid={this.state.uid}
          btcaddr={this.state.paymentAddr}
          btcPrice={btcPrice}
          back={back}
        />
      </div>
    )
  }
}

export default App
