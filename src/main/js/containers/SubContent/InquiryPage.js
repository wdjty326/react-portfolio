import React, { Component } from 'react';
import { Alert, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap';
import axios from 'axios';
import { WEB_APPLICATION_URI } from '../../configuration';

const SuccessMessageAlert = () => (
	<Alert bsStyle="success" >
		<h4>메일을 전송하였습니다.</h4>
	</Alert>
);

const DangerMessageAlert = () => (
	<Alert bsStyle="danger" >
		<strong>메일 전송에 실패하였습니다.</strong>
	</Alert>
);

const FieldGroup = ({ id, label, help, ...props }) => {
	return (
		<FormGroup controlId={id}>
			<ControlLabel>{label}</ControlLabel>
			<FormControl {...props} />
			{help && <HelpBlock>{help}</HelpBlock>}
		</FormGroup>
  );
}

const regExp_Email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

/*
 * 메일 발송 기능 추가
 */
export default class InquiryPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			SuccessMessageAlert : false,
			DangerMessageAlert : false,
			subject : "",
			address : "",
			name : "",
			content : ""
		};


		this.handlerSumbit = this.handlerSumbit.bind(this);

		this.onChangeSubject = this.onChangeSubject.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangeContent = this.onChangeContent.bind(this);

	}

	onChangeSubject(event) {
		this.setState({
			subject : event.target.value
		});
	}

	onChangeName(event) {
		this.setState({
			name : event.target.value
		});
	}

	onChangeEmail(event) {
		this.setState({
			address : event.target.value
		});
	}

	onChangeContent(event) {
		this.setState({
			content : event.target.value
		});
	}

	handlerSumbit(event) {
		event.preventDefault();
		const { toggleAjaxLoad } = this.props;
		// console.log(event);
		// window.alert('현재 페이지 backend 부분을 전반적으로 수정중 이므로, 2019월 3일 20일자로 메일 발송을 임시 중단합니다.');

		axios.interceptors.request.use(
			request => {
				// console.log("언제발생합니까?", request);
				toggleAjaxLoad();
				return request;
			},
			error => {
				// console.log("와카리마셍?", error);
				toggleAjaxLoad();
				return Promise.reject(error);
			}
		);
		if ( regExp_Email.test(this.state.address) ) {
			axios.post(`${WEB_APPLICATION_URI}sendmail`, this.state).then(response => {
				setTimeout(() => {
					toggleAjaxLoad();
					if (response.data.success) {
						this.setState({
							SuccessMessageAlert : true,
							DangerMessageAlert : false
						});
					} else {
						this.setState({
							SuccessMessageAlert : false,
							DangerMessageAlert : true
						});
					}	
				}, 1000);
			}).catch(function(error){
				console.log(error);
			});
		}
	}

	render() {
		return (
			<div className="InquiryPage">
				<div className="MainText">
				문의하기
				</div>
				{
					(this.state.SuccessMessageAlert) ? SuccessMessageAlert(this.handleSuccessMessageAlertDismiss) : null
				}
				{
					(this.state.DangerMessageAlert) ? DangerMessageAlert(this.handleDangerMessageAlertDismiss) : null
				}
				<form onSubmit={this.handlerSumbit}>
					<FieldGroup
				      id="formControlsSubject"
				      type="text"
				      label="Subject"
				      placeholder="Ex)문의하기"
							onChange={this.onChangeSubject}
				    />
						<FieldGroup
				      id="formControlsName"
				      type="text"
				      label="name"
				      placeholder="Ex)홍길동"
							onChange={this.onChangeName}
				    />
				    <FieldGroup
				      id="formControlsEmail"
				      type="email"
				      label="Email"
				      placeholder="Ex)gildong@gmail.com"
							onChange={this.onChangeEmail}
				    />
				    <FormGroup controlId="formControlsMessage">
      					<ControlLabel>Message</ControlLabel>
      					<FormControl componentClass="textarea" placeholder="Message" onChange={this.onChangeContent} />
    				</FormGroup>
						<Button type="submit" bsStyle="primary" bsSize="large" block>
				      메일전송
				    </Button>
				</form>
				<footer className="page-footer font-small blue">
					<div className="footer-copyright text-center py-3">© 2018 Copyright:
						<a href="https://react-bootstrap.github.io/"> react-bootstrap.github.io</a>
					</div>
				</footer>
			</div>
		);
	}
};
