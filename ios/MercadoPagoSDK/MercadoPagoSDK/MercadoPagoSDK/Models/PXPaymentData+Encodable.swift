//
//  PXPaymentData+Encodable.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 26/06/2019.
//

import Foundation

extension PXPaymentData: Encodable {

    /// :nodoc:
    public func encode(to encoder: Encoder) throws {

        var container = encoder.container(keyedBy: PXPaymentDataCodingKeys.self)
        try container.encodeIfPresent(self.paymentMethod, forKey: .paymentMethod)
        try container.encodeIfPresent(self.issuer, forKey: .issuer)
        try container.encodeIfPresent(self.payerCost, forKey: .payerCost)
        try container.encodeIfPresent(self.token, forKey: .token)
        try container.encodeIfPresent(self.payer, forKey: .payer)
        try container.encodeIfPresent(self.transactionAmount?.decimalValue, forKey: .transactionAmount)
        try container.encodeIfPresent(self.transactionDetails, forKey: .transactionDetails)
        try container.encodeIfPresent(self.discount, forKey: .discount)
        try container.encodeIfPresent(self.campaign, forKey: .campaign)
        try container.encodeIfPresent(self.consumedDiscount, forKey: .consumedDiscount)
    }

    enum PXPaymentDataCodingKeys: String, CodingKey {

        case paymentMethod = "payment_method"
        case issuer
        case payerCost = "payer_cost"
        case token
        case payer
        case transactionAmount = "transaction_amount"
        case transactionDetails = "transaction_details"
        case discount
        case campaign
        case consumedDiscount = "consumed_discount"
    }
}
