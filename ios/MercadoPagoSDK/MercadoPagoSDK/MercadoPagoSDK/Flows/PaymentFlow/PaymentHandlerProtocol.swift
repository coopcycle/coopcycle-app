//
//  PaymentHandlerProtocol.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 22/01/2019.
//

import Foundation

internal protocol PaymentHandlerProtocol {
    func handlePayment(payment: PXPayment)
    func handlePayment(business: PXBusinessResult)
    func handlePayment(basePayment: PXBasePayment)
}
