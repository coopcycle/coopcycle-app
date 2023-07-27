//
//  ApiDomain.swift
//  MercadoPagoSDK
//
//  Created by Eric Ertl on 23/09/2019.
//

import Foundation

internal struct ApiDomain {
    internal static let BASE_DOMAIN = "mercadopago.sdk."
    static let GET_CUSTOMER = "\(BASE_DOMAIN)CustomService.getCustomer"
    static let CREATE_PAYMENT = "\(BASE_DOMAIN)CustomService.createPayment"
    static let CREATE_PREFERENCE = "\(BASE_DOMAIN)CustomService.createCheckoutPreference"
    static let GET_DISCOUNT = "\(BASE_DOMAIN)DiscountService.getDiscount"
    static let GET_CAMPAIGNS = "\(BASE_DOMAIN)DiscountService.getCampaigns"
    static let GET_TOKEN = "\(BASE_DOMAIN)GatewayService.getToken"
    static let CLONE_TOKEN = "\(BASE_DOMAIN)GatewayService.cloneToken"
    static let GET_IDENTIFICATION_TYPES = "\(BASE_DOMAIN)IdentificationService.getIdentificationTypes"
    static let GET_INSTRUCTIONS = "\(BASE_DOMAIN)InstructionsService.getInstructions"
    static let GET_PAYMENT_METHODS = "\(BASE_DOMAIN)PaymentMethodSearchService.getPaymentMethods"
    static let GET_SUMMARY_AMOUNT = "\(BASE_DOMAIN)PaymentService.getSummaryAmount"
    static let GET_ISSUERS = "\(BASE_DOMAIN)PaymentService.getIssuers"
    static let GET_PREFERENCE = "\(BASE_DOMAIN)PreferenceService.getPreference"
    static let GET_PROMOS = "\(BASE_DOMAIN)PromosService.getPromos"
}
