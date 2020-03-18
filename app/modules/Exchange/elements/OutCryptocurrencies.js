import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'

import CustomIcon from '../../../components/elements/CustomIcon.js'

import accountDS from '../../../appstores/DataSource/Account/Account'
import { showModal } from '../../../appstores/Actions/ModalActions'
import { strings } from '../../../services/i18n'


class OutCryptocurrencies extends Component {

    constructor(props){
        super(props)
        this.state = {
            availableOutCryptocurrencies: []
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps){
        if(typeof nextProps.selectedOutCryptocurrency.currencyCode != 'undefined' && this.props.selectedInCryptocurrency.currencyCode === nextProps.selectedOutCryptocurrency.currencyCode && this.props.selectedOutCryptocurrency.currencyCode !== nextProps.selectedOutCryptocurrency.currencyCode){
            this.props.refInCryptocurrencies.setCryptocurrency({ key: this.props.selectedOutCryptocurrency.currencyCode, value: this.getValueForSelected(this.props.selectedOutCryptocurrency) })
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount() {
        this.init()
    }

    init = () => {
        const { currencies: cryptocurrencies } = this.props.mainStore
        const { extendsFields } = this.props
        const exchangeApiConfig = JSON.parse(JSON.stringify(this.props.exchangeStore.exchangeApiConfig))

        let cryptocurrenciesList = exchangeApiConfig.map(item => item[extendsFields.outCryptocurrency])

        cryptocurrenciesList = cryptocurrencies.map(item => {
            if(cryptocurrenciesList.includes(item.currencyCode)){
                return item
            }
        })

        cryptocurrenciesList = cryptocurrenciesList.filter((el) => {
            return el != null
        })





        const param = this.props.navigation.getParam('exchangeScreenParam')

        const cryptocurrencyTmp = typeof param != 'undefined' ? { key: param.selectedCryptocurrency.currencyCode, value: `${param.selectedCryptocurrency.currencyName} (${param.selectedCryptocurrency.currencyCode})`} : { key: 'ETH', value: 'Ethereum (ETH)' }

        this.setState({
            availableOutCryptocurrencies: cryptocurrenciesList
        }, () => {
            this.handleSelectCryptocurrency(cryptocurrencyTmp)
        })
    }

    setCryptocurrency = cryptocurrency => this.handleSelectCryptocurrency(cryptocurrency)

    // init = (nextProps) => {
    //     const { selectedInCryptocurrency } = nextProps
    //     const { currencies: cryptocurrencies } = this.props.mainStore
    //     const { extendsFields } = this.props
    //     const exchangeApiConfig = JSON.parse(JSON.stringify(this.props.exchangeStore.exchangeApiConfig))
    //
    //     let cryptocurrenciesList
    //
    //     cryptocurrenciesList = exchangeApiConfig.map(item => {
    //         if(item[extendsFields.inCryptocurrency] === selectedInCryptocurrency.currencyCode){
    //             return item[extendsFields.outCryptocurrency]
    //         }
    //     })
    //
    //     cryptocurrenciesList = cryptocurrencies.map(item => {
    //         if(cryptocurrenciesList.includes(item.currencyCode)){
    //             return item
    //         }
    //     })
    //
    //     cryptocurrenciesList = cryptocurrenciesList.filter((el) => {
    //         return el != null
    //     })
    //
    //     this.setState({
    //         availableInCryptocurrencies: cryptocurrenciesList
    //     }, () => {
    //         if(typeof nextProps.selectedOutCryptocurrency.currencyCode == 'undefined'){
    //             this.handleSelectCryptocurrency({ key: 'ETH', value: 'Ethereum' })
    //         }
    //     })
    // }

    handleSelectCryptocurrency = async (cryptocurrency) => {
        const { selectedWallet, currencies } = this.props.mainStore
        const { selectedInCryptocurrency, handleGetExchangeWay, extendsFields } = this.props
        const availableOutCryptocurrencies = JSON.parse(JSON.stringify(this.state.availableOutCryptocurrencies))

        let selectedOutCryptocurrency = availableOutCryptocurrencies.filter(item => item.currencyCode === cryptocurrency.key)
        selectedOutCryptocurrency = selectedOutCryptocurrency[0]

        let selectedOutAccount = await accountDS.getAccountData({wallet_hash : selectedWallet.wallet_hash, currency_code : selectedOutCryptocurrency.currencyCode})
        selectedOutAccount = selectedOutAccount[0]

        const exchangeWay = handleGetExchangeWay(selectedInCryptocurrency, selectedOutCryptocurrency)

        if(typeof exchangeWay === "undefined"){
            let exchangeApiConfig = JSON.parse(JSON.stringify(this.props.exchangeStore.exchangeApiConfig))

            exchangeApiConfig = exchangeApiConfig.filter(item => item[extendsFields.outCryptocurrency] === selectedOutCryptocurrency.currencyCode)

            let cryptocurrenciesList = exchangeApiConfig.map(item => item[extendsFields.inCryptocurrency])

            cryptocurrenciesList = currencies.map(item => {
                if(cryptocurrenciesList.includes(item.currencyCode)){
                    return item
                }
            })

            cryptocurrenciesList = cryptocurrenciesList.filter((el) => {
                return el != null
            })

            let selectedInAccount = await accountDS.getAccountData({wallet_hash : selectedWallet.wallet_hash, currency_code : cryptocurrenciesList[0].currencyCode})
            selectedInAccount = selectedInAccount[0]

            const selectedInCryptocurrency = currencies.find(item => item.currencyCode === cryptocurrenciesList[0].currencyCode)

            this.props.handleSetState('selectedInCryptocurrency', selectedInCryptocurrency)
            this.props.handleSetState('selectedInAccount', selectedInAccount)

            this.props.handleSetState('selectedOutCryptocurrency', selectedOutCryptocurrency)
            this.props.handleSetState('selectedOutAccount', selectedOutAccount)
        } else {
            this.props.handleSetState('selectedOutCryptocurrency', selectedOutCryptocurrency)
            this.props.handleSetState('selectedOutAccount', selectedOutAccount)
        }
    }

    getValueForSelected = (selectedCryptocurrency) => {
        if(selectedCryptocurrency.currencyCode === 'USDT')
            return `USDT - Tether OMNI`
        else if(selectedCryptocurrency.currencyCode === 'ETH_USDT')
            return `USDT - Tether ERC20`
        else
            return `${selectedCryptocurrency.currencySymbol} - ${selectedCryptocurrency.currencyName}`
    }

    handleOpenSelectTradeCryptocurrency = () => {

        const availableOutCryptocurrencies = JSON.parse(JSON.stringify(this.state.availableOutCryptocurrencies))
        const selectedOutCryptocurrency = JSON.parse(JSON.stringify(this.props.selectedOutCryptocurrency))

        const selectedItem = {
            key: selectedOutCryptocurrency.currencySymbol,
            value: this.getValueForSelected(selectedOutCryptocurrency)
        }

        const listForSelect = availableOutCryptocurrencies.map(item => {
            if(item.currencyCode === 'USDT')
                return { key: item.currencyCode, value : `USDT - Tether OMNI`}
            else if(item.currencyCode === 'ETH_USDT')
                return { key: item.currencyCode, value : `USDT - Tether ERC20`}
            else
                return { key: item.currencyCode, value : `${item.currencySymbol} - ${item.currencyName}`}
        })

        listForSelect.push(listForSelect.splice(listForSelect.findIndex(v => v.key === 'LTC'), 1)[0])

        showModal({
            type: 'SELECT_MODAL',
            data: {
                title: strings('tradeScreen.selectCrypto'),
                listForSelect,
                selectedItem
            }
        }, (selectedItem) => {
            this.handleSelectCryptocurrency(selectedItem)
        })
    }

    renderSelectedCryptocurrency = (selectedOutCryptocurrency) => {

        if(selectedOutCryptocurrency.currencyCode === 'USDT')
            return `OMNI`
        else if(selectedOutCryptocurrency.currencyCode === 'ETH_USDT')
            return `ERC20`
        else
            return selectedOutCryptocurrency.currencyName

    }

    handleMainRender = () => {
        const { selectedOutCryptocurrency } = this.props

        if(typeof selectedOutCryptocurrency.currencyCode !== 'undefined' ){
            return (
                <TouchableOpacity style={[styles.select, styles.select_active]} onPress={this.handleOpenSelectTradeCryptocurrency}>
                    <CustomIcon style={styles.select__currencyIcon} name={selectedOutCryptocurrency.currencyCode} />
                    <Text style={styles.select__text} numberOfLines={1}>{ this.renderSelectedCryptocurrency(selectedOutCryptocurrency) }</Text>
                    <View style={styles.select__icon__wrap}>
                        <Ionicons style={styles.select__icon} name='ios-arrow-down' />
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity style={styles.select} onPress={this.handleOpenSelectTradeCryptocurrency}>
                <Text style={styles.select__text}>{ strings('tradeScreen.crypto') }</Text>
                <View style={styles.select__icon__wrap}>
                    <Ionicons style={styles.select__icon} name='ios-arrow-down' />
                </View>
            </TouchableOpacity>
        )

    }

    render() {
        return this.handleMainRender()
    }
}

const mapStateToProps = (state) => {
    return {
        exchangeStore: state.exchangeStore,
        mainStore: state.mainStore
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(OutCryptocurrencies)


const styles = {
    select: {
        position: 'relative',

        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 15,
        height: 44,

        backgroundColor: '#7127AC',
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    select_active: {
        backgroundColor: '#A168F2',
    },
    select__text: {
        flex: 1,

        marginRight: 'auto',

        fontSize: 19,
        fontFamily: 'SFUIDisplay-Regular',
        color: '#fff'
    },
    select__currencyIcon: {
        marginRight: 13,

        color: '#fff',
        fontSize: 18,
    },
    select__icon: {
        height: 21,

        color: '#fff',
        fontSize: 22,
    },
}
