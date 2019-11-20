import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';
import api from '../../services/api';

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author } from './styles';
import { StackViewTransitionConfigs } from 'react-navigation-stack';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class User extends Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation : PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired
    }

    state = {
        stars: [],
        loading: false,
        userLogin: '',
        page: 2,
        refreshing: false
    }

    async componentDidMount(){
        this.setState({loading: true})
        const {navigation} = this.props;
        const user = navigation.getParam('user');
        const response = await api.get(`users/${user.login}/starred`);


        this.setState({stars: response.data, loading: false, userLogin: user.login })

    }

    loadMore = async () => {
        const { userLogin, page, stars} = this.state;


        const response = await api.get(`users/${userLogin}/starred`, {
            params: {
                page : page
            }
        });



        this.setState({
            stars: [...stars, ...response.data],
            page: page + 1
        });


    }

    handleNavigate= (repository) => {
        const {navigation} = this.props;
        navigation.navigate('Repository', {repository});
    }


    refreshList = async () => {
        const {userLogin} = this.state;

        this.setState({refreshing: true});

        const response = await api.get(`users/${userLogin}/starred`);

        this.setState({
            stars: response.data,
            refreshing: false
        })

    }


    render(){
        const {stars, loading} = this.state;
        const {navigation} = this.props;
        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{uri: user.avatar}} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (<ActivityIndicator />) : ( <Stars
                    onEndReachedThreshold={0.2}
                    onEndReached={this.loadMore}
                    onRefresh={this.refreshList}
                    refreshing={this.state.refreshing}
                    data={stars}
                    keyExtractor = {star => String(star.id)}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback onPress={() => this.handleNavigate(item)}>
                        <Starred >

                            <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                        </TouchableWithoutFeedback>
                    )}
                />)}




            </Container>
        )
    }

}
