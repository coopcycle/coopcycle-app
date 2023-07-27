//
//  PXResult.swift
//  MercadoPagoSDKV4
//
//  Created by Demian Tejo on 19/9/18.
//

@objc
public protocol PXResult: NSObjectProtocol {
    func getPaymentId() -> String?
    func getStatus() -> String
    func getStatusDetail() -> String
}

@objc
public protocol PXBasePayment: PXResult {
    func getPaymentMethodId() -> String?
    func getPaymentMethodTypeId() -> String?
}
