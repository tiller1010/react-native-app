import * as React from 'react';
import PremiumVideoChatListing from './PremiumVideoChatListing.jsx';
import graphQLFetch from '../graphQLFetch.js';
import LanguageSelector from './LanguageSelector.jsx';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import Styles from '../Styles.js';

export default class PremiumVideoChatListingFeed extends React.Component {
  constructor(props){
    super(props);
    let state = {
      topic: '',
      languageOfTopic: '',
      premiumVideoChatListings: [],
      loaded: false,
    }
    this.state = state;
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  async componentDidMount(){

    const query = `query getRecentPremiumVideoChatListings{
      getRecentPremiumVideoChatListings{
        listings {
          _id
          topic
          languageOfTopic
          duration
          price
          currency
          thumbnailSrc
          userID
          timeSlots {
            date
            time
            customerUserID
            completed
            booked
            paid
          }
        }
      }
    }`;
    const data = await graphQLFetch(query);
    if(data.getRecentPremiumVideoChatListings){
      if(data.getRecentPremiumVideoChatListings.listings){
        this.setState({
          premiumVideoChatListings: data.getRecentPremiumVideoChatListings.listings,
          loaded: true,
        });
      }
    }
  }


  handleLanguageChange(languageName) {
    this.setState({ languageOfTopic: languageName }, () => {
      this.handleSearchSubmit();
    });
  }

  async handleSearchSubmit(){
    let {
      topic,
      languageOfTopic
    } = this.state;
    topic = topic.replace(/\s$/, '');

    const query = `query searchPremiumVideoChatListings($topic: String, $languageOfTopic: String){
      searchPremiumVideoChatListings(topic: $topic, languageOfTopic: $languageOfTopic){
        listings {
          _id
          topic
          languageOfTopic
          duration
          price
          currency
          thumbnailSrc
          userID
          timeSlots {
            date
            time
            customerUserID
            completed
            booked
            paid
          }
        }
      }
    }`;
    const data = await graphQLFetch(query, {
      topic,
      languageOfTopic,
    });
    if(data.searchPremiumVideoChatListings){
      if(data.searchPremiumVideoChatListings.listings){
        this.setState({
          premiumVideoChatListings: data.searchPremiumVideoChatListings.listings
        });
      }
    }
  }

  render(){

    const { authenticatedUserID } = this.props;

    let {
      premiumVideoChatListings,
      topic,
      languageOfTopic,
      loaded,
    } = this.state;

    return(
      <View>
        <View>
          <View style={Styles.pad}>
            <View>
              <View>
                { this.props.SearchFormHeading ? <Text style={Styles.heading}>{this.props.SearchFormHeading}</Text> : '' }
                <Searchbar type="text" placeholder="Search" onChangeText={(text) => this.setState({topic: text})} value={topic}
                  style={{
                    borderWidth: 1,
                    borderColor: 'black'
                  }}
                  onIconPress={this.handleSearchSubmit}
                  onSubmitEditing={this.handleSearchSubmit}
                />
              </View>
              <View style={{...Styles.flex, ...Styles.xCenter}}>
                <View style={Styles.halfPad}>
                  <LanguageSelector name="languageOfTopic" id="videoChat_languageOfTopicField" onChange={this.handleLanguageChange} value={languageOfTopic} required={false}/>
                </View>
                <View style={Styles.halfPad}>
                  <Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={this.handleSubmit}>Search</Button>
                </View>
              </View>
            </View>
          </View>
          {!this.props.HideClearFilters ?
            <View>
            <>
            {/*
              <a href="/chats" aria-label="Clear filters" className="button">
                Clear filters
              </a>
            */}
            </>
            </View>
            :
            <Text></Text>
          }
        </View>
        {premiumVideoChatListings.length ?
          <ScrollView horizontal>
            {premiumVideoChatListings.map((listing) =>
              <View key={premiumVideoChatListings.indexOf(listing)}>
                <View style={{ ...Styles.pad, width: 400 }}>
                  <PremiumVideoChatListing
                    premiumVideoChatListing={listing}
                    authenticatedUserID={authenticatedUserID}
                    view={authenticatedUserID == listing.userID ? 'owner' : 'customer'}
                    navigation={this.props.navigation}
                  />
                </View>
              </View>
            )}
          </ScrollView>
          :
          <>{loaded ? <Text>No video chats found</Text> : <View className="lds-facebook"><View></View><View></View><View></View></View>}</>
        }
      </View>
    );
  }
}
