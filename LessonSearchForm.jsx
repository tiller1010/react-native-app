import * as React from 'react';
import graphQLFetch from './graphQLFetch.js';
import LanguageSelector from './LanguageSelector.jsx';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';

export default class LessonSearchForm extends React.Component {
	constructor(props){
		super(props);
		let state = {
			topicQuery: '',
			languageOfTopic: '',
		}
		this.state = state;
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
	}

	componentDidMount() {
		if (this.props.languageOfTopic != this.state.languageOfTopic && this.props.languageOfTopic) {
			var context = this;
			this.setState({ languageOfTopic: this.props.languageOfTopic}, () => {
				context.handleSearchSubmit((new Event('submit')));
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.languageOfTopic != this.props.languageOfTopic && this.props.languageOfTopic) {
			var context = this;
			this.setState({ languageOfTopic: this.props.languageOfTopic}, () => {
				context.handleSearchSubmit((new Event('submit')));
			});
		}
	}

	handleLanguageChange(event) {
		this.setState({ languageOfTopic: event.target.value });
	}

	async handleSearchSubmit(event) {
		event.preventDefault();

		let {
			topicQuery,
			languageOfTopic
		} = this.state;
		topicQuery = topicQuery.replace(/\s$/, '');

		const query = `query searchLessons($topicQuery: String, $languageOfTopic: String){
			searchLessons(topicQuery: $topicQuery, languageOfTopic: $languageOfTopic){
				levels {
					id
					attributes {
						Level
						topics {
							data {
								id
								attributes {
									Topic
									FeaturedMedia {
										data {
											attributes {
												mime
												url
												alternativeText
											}
										}
									}
									challenges {
										data {
											attributes {
												Title
												Content
												FeaturedMedia {
													data {
														attributes {
															mime
															url
															alternativeText
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				showChallenge
			}
		}`;
		const data = await graphQLFetch(query, {
			topicQuery,
			languageOfTopic,
		});

		data.lessonLanguageFilter = languageOfTopic;

		if (this.props.onSubmit) {
			this.props.onSubmit(data);
		}
	}

	render(){

		const { topicQuery, languageOfTopic } = this.state;

		return(
			<View className="fw-form search-form">
				<View className="flex-container flex-vertical-stretch">
					<View className="field text tablet-100">
						<Text htmlFor="topicQueryField">Search</Text>
						<Searchbar type="text" placeholder="Search" onChangeText={(text) => this.setState({topicQuery: text})} value={this.state.topicQuery}
							style={{
								borderWidth: 1,
								borderColor: 'black'
							}}
							onIconPress={this.handleSearchSubmit}
							onSubmitEditing={this.handleSearchSubmit}
						/>
					</View>
					<View className="flex-container tablet-100" style={{ flexWrap: 'nowrap' }}>
						<View className="tablet-100">
							<LanguageSelector name="languageOfTopic" id="lessonContent_languageOfTopicField" onChange={this.handleLanguageChange} value={languageOfTopic} required={false}/>
						</View>
						<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={this.handleSearchSubmit}>
							Search
						</Button>
					</View>
				</View>
			</View>
		);
	}
}