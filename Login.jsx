import React from 'react';
import { Text, View, Image, Button as TextButton, ScrollView, Alert } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, TextInput, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			errors: [],
			displayName: '',
			password: ''
		}
		this.handleDisplayNameChange = this.handleDisplayNameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.createAlert = this.createAlert.bind(this);
	}

	componentDidMount(){
		if(this.props.errors){
			this.setState({
				errors: JSON.parse(this.props.errors)
			});
		}
	}

	handleDisplayNameChange(text){
		this.setState({
			displayName: text
		});
	}

	handlePasswordChange(text){
		this.setState({
			password: text
		});
	}

	async handleSubmit(){
		const state = {...this.state};
		if(state.displayName && state.password){
			console.log('Fetching from:', process.env.APP_SERVER_URL);
			await fetch(`${process.env.APP_SERVER_URL}/react-native-login`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					nativeFlag: true,
					displayName: state.displayName,
					password: state.password
				})
			}).then((response) => response.json())
			  .then(async (user) => {
				  	if(user._id){
						await AsyncStorage.setItem('@user', JSON.stringify(user));
						this.props.navigation.navigate('Account Profile', { user });
				  	}
				})
			  .catch((e) => this.createAlert('Login invalid', true));
		} else {
			this.createAlert('Complete the form before submitting');
		}
	}

	createAlert(alertPhrase, clearState = false){

		const emptyVideo = {
			cancelled: false,
			duration: 1000,
			height: 1000,
			type: 'video',
			uri: '',
			width: 720
		}
		Alert.alert(
			alertPhrase,
			'',
			[{
				text: 'Close',
				onPress: () => {
					if(clearState){
						this.setState({ password: '' });
					}
				}
			}]
		);
	}

	render(){
		return (
			<ScrollView>
				<View style={Styles.pad}>
					{this.state.errors.length ?
						<View className="errors">
							{this.state.errors.map((error) =>
								<Text key={this.state.errors.indexOf(error)}>
									{error}
								</Text>
							)}
						</View>
						:
						<Text></Text>
					}
					<View>
						<View>
							<TextInput label="Display Name" onChangeText={(text) => this.handleDisplayNameChange(text)} value={this.state.displayName}/>
						</View>
						<View>
							<TextInput label="Password" onChangeText={(text) => this.handlePasswordChange(text)} value={this.state.password} secureTextEntry/>
						</View>
						<View>
						<Button icon="arrow-right" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={this.handleSubmit}>
							Login
						</Button>
						</View>
					</View>
					<Button icon="arrow-right" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
						this.props.navigation.navigate('Register')
					}>Register</Button>
					<Button icon="google" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
						this.props.navigation.navigate('Register')
					}>Login with Google</Button>
				</View>
			</ScrollView>
		);
	}
}

export default Login;