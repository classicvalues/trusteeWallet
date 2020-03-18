import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'

import CustomIcon from '../../../components/elements/CustomIcon.js'

import accountDS from '../../../appstores/DataSource/Account/Account'
import { showModal } from '../../../appstores/Actions/ModalActions'
import { strings } from '../../../services/i18n'
import Log from '../../../services/Log/Log'
import utils from '../../../services/utils'


class Cryptocurrencies extends Component {

    constructor(props){
        super(props)
        this.state = {
            availableCryptocurrencies: []
        }
    }

    // eslint-disable-next-line camelcase
    async UNSAFE_componentWillMount() {
        this.init()
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if( this.props.selectedCryptocurrency.currencyCode !== nextProps.selectedCryptocurrency.currencyCode){
            this.handleSelectCryptocurrency({ key: nextProps.selectedCryptocurrency.currencyCode }, false)
        }
    }

    init = () => {
        try {

            const cryptocurrencies = JSON.parse(JSON.stringify(this.props.mainStore.currencies))

            const { selectedCryptocurrency, extendsFields } = this.props
            const tradeApiConfig = JSON.parse(JSON.stringify(this.props.exchangeStore.tradeApiConfig))

            let cryptocurrenciesList

            cryptocurrenciesList = tradeApiConfig.exchangeWays.map(item => item[extendsFields.fieldForCryptocurrency])

            cryptocurrenciesList = cryptocurrencies.map(item => {
                if(cryptocurrenciesList.includes(item.currencyCode)){
                    return item
                }
            })

            cryptocurrenciesList = cryptocurrenciesList.filter((el) => {
                return el != null
            })

            const param = this.props.navigation.getParam('exchangeScreenParam')

            let cryptocurrencyTmp = {}

            if(typeof param !== "undefined"){
                cryptocurrencyTmp = { key: param.selectedCryptocurrency.currencyCode, value: `${param.selectedCryptocurrency.currencyName} (${param.selectedCryptocurrency.currencyCode})`}
            } else if (typeof selectedCryptocurrency.currencyCode === "undefined") {
                cryptocurrencyTmp = { key: 'BTC', value: 'Bitcoin (BTC)' }
            }

            this.setState({
                availableCryptocurrencies: cryptocurrenciesList
            }, () => {
                this.handleSelectCryptocurrency(cryptocurrencyTmp, false)
            })
        } catch (e) {
            Log.err('Cryptocurrencies.init error ' + e.message)
        }
    }

    drop = () => {
        this.setState({
            availableCryptocurrencies: []
        })
    }

    handleSelectCryptocurrency = async (cryptocurrency, isReInit) => {
        try {
            const { self } = this.props
            const { selectedWallet } = this.props.mainStore
            const { tradeType } = this.props.exchangeStore

            const availableCryptocurrencies = JSON.parse(JSON.stringify(this.state.availableCryptocurrencies))

            let selectedCryptocurrency = availableCryptocurrencies.filter(item => item.currencyCode === cryptocurrency.key)
            selectedCryptocurrency = selectedCryptocurrency[0]

            let selectedAccount

            selectedAccount = await accountDS.getAccountData({
                wallet_hash: selectedWallet.wallet_hash,
                currency_code: selectedCryptocurrency.currencyCode,
                segwit: "segwit"
            })

            if(selectedCryptocurrency.currencyCode === "BTC" && tradeType === "BUY"){
                if(typeof selectedAccount.segwit[0] !== 'undefined') {
                    this.props.handleSetState('uniqueParams', {
                        ...self.state.uniqueParams,
                        segwitOutDestination: selectedAccount.segwit[0].address
                    })
                }
                selectedAccount = selectedAccount.legacy[0]
            } else {
                selectedAccount = selectedAccount[0]
                typeof self !== "undefined" ? delete self.state.uniqueParams.segwitOutDestination : null
            }


            // TODO: romove kostil
            if(isReInit){
                this.props.handleSetState('selectedPaymentSystem', '')
                this.props.refFiatCurrencies.reInit(selectedCryptocurrency)
            }
            // TODO: ***************************

            console.log(selectedCryptocurrency)
            console.log(selectedAccount)

            if(tradeType === "BUY"){
                utils.checkTransferHasError(selectedCryptocurrency.currencyCode, selectedAccount.address)
            }

            this.props.handleSetState('selectedCryptocurrency', selectedCryptocurrency)
            this.props.handleSetState('selectedAccount', selectedAccount)
        } catch (e) {
            Log.err('Cryptocurrencies.handleSelectCryptocurrency error ' + JSON.stringify(e))
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

        const availableCryptocurrencies = JSON.parse(JSON.stringify(this.state.availableCryptocurrencies))
        const selectedCryptocurrency = JSON.parse(JSON.stringify(this.props.selectedCryptocurrency))

        const selectedItem = {
            key: selectedCryptocurrency.currencySymbol,
            value: this.getValueForSelected(selectedCryptocurrency)
        }

        const listForSelect = availableCryptocurrencies.map(item => {
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
            this.handleSelectCryptocurrency(selectedItem, true)
        })
    }

    renderSelectedCryptocurrency = (selectedCryptocurrency) => {

        if(selectedCryptocurrency.currencyCode === 'USDT')
            return `OMNI`
        else if(selectedCryptocurrency.currencyCode === 'ETH_USDT')
            return `ERC20`
        else
            return selectedCryptocurrency.currencyName

    }

    handleMainRender = () => {
        const { selectedCryptocurrency } = this.props

        if(typeof selectedCryptocurrency.currencyCode !== 'undefined' ){
            return (
                <TouchableOpacity style={[styles.select, styles.select_active]} onPress={this.handleOpenSelectTradeCryptocurrency}>
                    <CustomIcon style={styles.select__currencyIcon} name={selectedCryptocurrency.currencyCode} />
                    <Text style={styles.select__text} numberOfLines={1}>{ this.renderSelectedCryptocurrency(selectedCryptocurrency) }</Text>
                    <View style={styles.select__icon__wrap}>
                        <Ionicons style={styles.select__icon} name='ios-arrow-down' />
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity style={styles.select} onPress={this.handleOpenSelectTradeCryptocurrency}>
                <CustomIcon name={selectedCryptocurrency.currencyCode} />
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

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Cryptocurrencies)


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
