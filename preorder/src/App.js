import React, { Component } from 'react';
import { validate } from 'email-validator'
import { countries } from 'countries-list'

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
	render () {
		if (!this.props.visible) {
			return <div></div>
		}
		const leftPad = (amount) => {
			const pad = '000'
			return pad.substring(0, pad.length - amount.length) + amount
		}
		const handleNameChange = (e) => this.setState({name: e.target.value})
		const handleEmailChange = (e) => this.setState({email: e.target.value})
		const handleBackupPhoneChange = (e) => this.setState({backupphone: e.target.value})
		const handleBackupEmailChange = (e) => this.setState({backupemail: e.target.value})
		const handleQuantityChange = (e) => {
			if (parseInt(e.target.value, 10) < 999) {
				this.setState({quantity: parseInt(e.target.value, 10)})
			}
		}
		const decrementQuantity = () => {
			if (this.state.quantity > 1) {
				this.setState({quantity: this.state.quantity-1})
			}
		}
		const incrementQuantity = () => {
			if (this.state.quantity < 999) {
				this.setState({quantity: this.state.quantity+1})
			}
		}
		const handleNextClick = () => {
			if (this.state.name === '' || this.state.email === '') {
				this.setState({error: 'name and email are required.'})
				return
			}
			if (this.state.quantity === 0) {
				this.setState({error: 'quantity must be greater than zero'})
				return
			}
			if (!validate(this.state.email)) {
				this.setState({error: 'invalid email address provided'})
				return
			}
			this.props.next(this.state)
		}
		return (
			<div className="container main order-main">
				<div className="need-help">
					<p>Need Help?</p><a href="mailto:hello@obelisk.tech">Contact us</a>
					<div className="separator-muted"></div>
				</div>
				<div className="row">
					<div className="col-md-4 order-section">
						<img className="obelisk-header" alt="logo" src="assets/img/obelisk-text.png" />
						<div className="separator"></div>
						<div className="order-form">
							<h3> 1. YOUR ORDER </h3>
							<input value={this.state.name} onChange={handleNameChange} type="text" className="form-control" placeholder="Full Name" />
							<input value={this.state.email} onChange={handleEmailChange} type="text" className="form-control" placeholder="Email" />
							<input value={this.state.backupemail} onChange={handleBackupEmailChange} type="text" className="form-control" placeholder="Backup Email (optional)" />
							<input value={this.state.backupphone} onChange={handleBackupPhoneChange} type="text" className="form-control" placeholder="Backup Phone (optional)" />
							<p className="input-error">{this.state.error}</p>
						</div>
						<div className="red-separator"></div>
						<div className="separator"></div>
						<div className="promotional-emails">
							<p> Would you like to receive promotional emails from us? </p>
							<input checked={this.state.newsletter} onChange={() => this.setState({newsletter: !this.state.newsletter})} type="checkbox" />
						</div>
					</div>
					<div className="col-md-1"></div>
					<div className="col-md-3 visible-md-block visible-lg-block">
						<img alt="hardware" className="hardware-shot" src="assets/img/hardware-shot.png" />
					</div>
					<div className="col-md-4 quantity-section">
						<h3> How many Obelisk SC1s would you like to purchase? </h3>
						<div className="quantity-form">
							<button onClick={decrementQuantity} className="minus-button"></button>
							<input onChange={handleQuantityChange} value={leftPad(this.state.quantity.toString())}></input>
							<button onClick={incrementQuantity} className="plus-button" ></button>
						</div>
						<div className="quantity-price">${2499 * this.state.quantity}</div>
						<div className="next-button" onClick={handleNextClick}></div>
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
			return <div></div>
		}
		const isEurope = (country) => {
			if (!countries.hasOwnProperty(country)) {
				return false
			}
			return countries[country].continent === 'EU'
		}
		const estimatedCost = () => {
			let baseCost = 70 
			if (this.state.country === 'US' || isEurope(this.state.country) || this.state.country === 'CN') {
				baseCost = 35 
			}
			let tax = 0
			if (this.state.country === 'US' && this.state.region.toLowerCase() === 'ma') {
				tax = 2499 * 0.0625
			}
			return parseFloat(((baseCost + tax) * this.props.quantity).toFixed(2))
		}
		const handleAddr1Change = (e) => this.setState({addr1: e.target.value})
		const handleAddr2Change = (e) => this.setState({addr2: e.target.value})
		const handleCityChange = (e) => this.setState({city: e.target.value})
		const handleStateChange = (e) => this.setState({region: e.target.value})
		const handlePostalChange = (e) => this.setState({postal: e.target.value})
		const handleCountryChange = (e) => this.setState({country: e.target.value})
		const handleNextClick = () => {
			if (this.state.addr1 === '') {
				this.setState({error: 'address must not be empty'})
				return
			}
			if (this.state.city === '') {
				this.setState({error: 'city must not be empty'})
				return
			}
			if (this.state.region === '') {
				this.setState({error: 'region must not be empty'})
				return
			}
			if (this.state.postal === '') {
				this.setState({error: 'postal code must not be empty'})
				return
			}
			if (this.state.country === '') {
				this.setState({error: 'please select a country'})
				return
			}
			this.props.next({address: `${this.state.addr1}\n${this.state.addr2}\n${this.state.city}\n${this.state.region}\n${this.state.postal}\n${this.state.country}`, shippingCost: estimatedCost()})
			
		}
		return (
			<div className="container main order-main">
				<div className="need-help">
					<p>Need Help?</p><a href="mailto:hello@obelisk.tech">Contact us</a>
					<div className="separator-muted"></div>
				</div>
				<div className="row">
					<div className="col-md-4 order-section">
						<img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
						<div className="separator"></div>
						<div className="order-form">
							<h3> 2. SHIPPING </h3>
							<input type="text" value={this.state.addr1} onChange={handleAddr1Change} className="form-control" placeholder="Address Line 1" />
							<input type="text" value={this.state.addr2} onChange={handleAddr2Change} className="form-control" placeholder="Address Line 2" />
							<input type="text" value={this.state.city} onChange={handleCityChange} className="form-control" placeholder="City" />
							<div className="statezip">
								<input type="text" value={this.state.region} onChange={handleStateChange} className="form-control" placeholder="State/Region" />
								<input type="text" value={this.state.postal} onChange={handlePostalChange} className="form-control" placeholder="ZIP/Postal Code" />
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
						<div onClick={this.props.back} className="back-button"></div>
						<div className="red-separator"></div>
						<div className="separator"></div>
					</div>
					<div className="col-md-1"></div>
					<div className="col-md-3 visible-md-block visible-lg-block">
						<img alt="hardware" className="hardware-shot" src="assets/img/hardware-shot.png" />
					</div>
					<div className="col-md-4 cost-section">
						<h3> Estimated sales tax and shipping costs </h3>
						<div className="estimated-cost"><span className="money">$</span><p className="amount">{estimatedCost()}</p></div>
						<p className="note">* Shipping costs are $35 per unit for US/Europe/China Customers and $70 per unit for anywhere else. Orders will ship on or before June 30, 2018.</p>
						<div className="next-button" onClick={handleNextClick}></div>
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
			checked: false,

			error: '',
		}
	}
	render() {
		if (!this.props.visible) {
			return <div></div>
		}
		const handleNextClick = () => {
			if (!this.state.checked) {
				this.setState({error: 'you must agree to the terms and conditions before continuing'})
				return
			}
			this.setState({error: ''})
			this.props.next()
		}
		return (
			<div className="container main order-main">
				<div className="need-help">
					<p>Need Help?</p><a href="mailto:hello@obelisk.tech">Contact us</a>
					<div className="separator-muted"></div>
				</div>
				<div className="row">
					<div className="col-md-4 order-section">
						<img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
						<div className="separator"></div>
						<div className="checkout order-form">
							<h3> 3. CHECKOUT </h3>
							<p> Payment is accepted in Bitcoin.</p>
							<p>Final cost. Proceed to the next page to get your payment address</p>
							<div className="estimated-cost">
								<span className="money">$</span>
								<p className="amount">{parseFloat(this.props.totalPrice.toFixed(2))}</p>
							</div>
							<p className="note">* If the Bitcoin exchange rate fluctuates by more than 5% before we can convert to USD, we will email you requesting additional payment in Bitcoin. We are using Gemini to exchange your coins as fast as possible.</p>
							<div onClick={this.props.back} className="back-button"></div>
							<div className="red-separator"></div>
							<div className="separator"></div>
						</div>
					</div>
					<div className="col-md-1"></div>
					<div className="col-md-3 visible-md-block visible-lg-block">
						<img alt="logo" className="hardware-shot" src="assets/img/hardware-shot.png" />
					</div>
					<div className="col-md-4 final-cost-section">
						<h3> Estimated final cost. Proceed to the next page to get the payment address</h3>
						<div className="cost-estimate">
							<div className="estimate">
								<div className="amount-label">BTC</div>
								<div className="amount">{parseFloat(this.props.btcPrice.toFixed(3))}</div>
							</div>
						</div>
						<div className="terms-check">
							<p>By checking this box, you agree to the <a href="/assets/img/terms.pdf" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and acknowledge the <a href="/assets/img/privacypolicy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a></p>
							<input checked={this.state.checked} onChange={() => this.setState({checked: !this.state.checked})} type="checkbox" name="terms-check" />
						</div>
						<div className="input-error">{this.props.checkoutError}</div>
						<div className="input-error">{this.state.error}</div>
						<div className="next-button" onClick={handleNextClick}></div>
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
			return <div></div>
		}
		return (
			<div className="container main order-main">
				<div className="need-help">
					<p>Need Help?</p><a href="mailto:hello@obelisk.tech">Contact us</a>
					<div className="separator-muted"></div>
				</div>
				<div className="row">
					<div className="col-md-4 order-section">
						<img alt="logo" className="obelisk-header" src="assets/img/obelisk-text.png" />
						<div className="separator"></div>
						<div className="payment order-form">
							<h3> 4. PAYMENT </h3>
							<p className="paywith">Pay with Bitcoin</p>
							<div className="payinfo">
								<img alt="qrcode" className="qrcode" src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=bitcoin:${this.props.btcaddr}?amount=${this.props.btcPrice}`} />
								<div className="payaddr">
									<p>Use the QR code or send <div className="price">{parseFloat(this.props.btcPrice.toFixed(3))} BTC </div>to the address below:</p>
									<br></br>
									<p>Deposit Address</p>
									<p className="addr">{this.props.btcaddr}</p>
								</div>
							</div>
							<div onClick={this.props.back} className="back-button"></div>
							<div className="red-separator"></div>
							<div className="separator"></div>
						</div>
					</div>
					<div className="col-md-1"></div>
					<div className="col-md-3 visible-md-block visible-lg-block">
						<img alt="hardware-shot" className="hardware-shot" src="assets/img/hardware-shot.png" />
					</div>
					<div className="col-md-4 payment-selection-section">
						<p className="confirmation-thanks">Thank you! You will receive a confirmation email shortly.</p>
						<div className="confirmation-info">
							<p>Your confirmation number is:</p>
							<h2 className="confirmation-number">{this.props.uid}</h2>
							<p className="keep-safe">Keep that reference number safe and treat it as a password!</p>
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
			ethUsd: 280,

			uid: '',
			paymentAddr: '',

			step: 0,
			checkoutError: '',
		}
		fetch('https://api.gdax.com/products/BTC-USD/ticker').then((res) => {
			res.json().then((data) => {
				this.setState({btcUsd: parseFloat(data.price)})
			})
		})
		fetch('https://api.gdax.com/products/ETH-USD/ticker').then((res) => {
			res.json().then((data) => {
				this.setState({ethUsd: parseFloat(data.price)})
			})
		})
	}
	render() {
		const totalPrice = (2499*this.state.quantity) + this.state.shippingCost
		const btcPrice = totalPrice / this.state.btcUsd
		const ethPrice = totalPrice / this.state.ethUsd
		const next = (result) => {
			this.setState(result)
			this.setState({ step: this.state.step+1})
		}
		const back = () => {
			this.setState({checkoutError: ''})
			if (this.state.step > 0) {
				this.setState({ step: this.state.step-1})
			}
		}
		const handleSubmit = () => {
			const formData = new FormData()
			formData.append('email', this.state.email)
			formData.append('newsletter', this.state.newsletter)
			formData.append('name', this.state.name)
			formData.append('address', this.state.address)
			formData.append('backupEmail', this.state.backupemail)
			formData.append('phone', this.state.backupphone)
			formData.append('units', this.state.quantity)
			formData.append('price', parseFloat(btcPrice.toFixed(3)))
			fetch(`/adduser`, {
				method: 'POST',
				body: formData,
			}).then((res) => {
				if (!res.ok) {
					res.text().then((text) => {
						if (text.includes('user with that email already exists')) {
							this.setState({checkoutError: 'a user has already ordered an Obelisk SC1 using that email. If you want to modify your order, contact hello@obelisk.tech.'})
						} else {
							this.setState({checkoutError: 'an unknown error has occurred and has been reported to the developers.'})
						}
					})
				} else {
					res.json().then((data) => {
						this.setState({uid: data.uniqueID, paymentAddr: data.paymentAddr})
						this.setState({step: 3})
					})
				}
			}).catch((err) => {
				this.setState({checkoutError: 'could not check out. try again in a few minutes.'})
			})
		}
		return (
			<div>
				<PageOne visible={this.state.step === 0} next={next} />
				<ShippingForm visible={this.state.step === 1} quantity={this.state.quantity} next={next} back={back} />
				<Checkout visible={this.state.step === 2} checkoutError={this.state.checkoutError} shippingCost={this.state.shippingCost} totalPrice={totalPrice} ethPrice={ethPrice} btcPrice={btcPrice}  next={handleSubmit} back={back} />
				<Payment visible={this.state.step === 3} uid={this.state.uid}  btcaddr={this.state.paymentAddr} btcPrice={btcPrice} back={back} />
			</div>
		)
	}
}

export default App;

