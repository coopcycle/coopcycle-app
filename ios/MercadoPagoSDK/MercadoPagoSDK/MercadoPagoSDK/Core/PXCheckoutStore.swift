//
//  PXCheckoutStore.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 11/28/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//
import Foundation

/**
  This class to provides information (like `PXPaymentData` or `PXCheckoutPreference`) about our Checkout.
 */
@objcMembers
open class PXCheckoutStore: NSObject {
    static let sharedInstance = PXCheckoutStore()
    internal var checkoutPreference: PXCheckoutPreference?
    internal var paymentDatas: [PXPaymentData] = []
    private var data = [String: Any]()
}

// MARK: - Getters
extension PXCheckoutStore {
    /**
     Get `PXPaymentData` object.
     */
    public func getPaymentData() -> PXPaymentData {
        return paymentDatas.first ?? PXPaymentData()
    }

    /**
     Get list of `PXPaymentData` for split payment.
     */
    public func getPaymentDatas() -> [PXPaymentData] {
        return paymentDatas
    }

    /**
     Get `PXCheckoutPreference` object.
     */
    public func getCheckoutPreference() -> PXCheckoutPreference? {
        return checkoutPreference
    }
}

// MARK: - DataStore
/**
 Extra methods to key-value store. You can save any interest value during checkout. Use this under your responsibility.
 */
extension PXCheckoutStore {
    /**
     Add key-value data.
     - parameter forKey: Key to save. Type: `String`
     - parameter value: Value to save. Type: `Any`
     */
    public func addData(forKey: String, value: Any) {
        self.data[forKey] = value
    }

    /**
     Remove data for key.
     - parameter key: Key to remove.
     */
    public func remove(key: String) {
        data.removeValue(forKey: key)
    }

    /**
     Clear all key-values.
     */
    public func removeAll() {
        data.removeAll()
    }

    /**
     Get data for key.
     - parameter forKey: Key to get data.
     */
    public func getData(forKey: String) -> Any? {
        return self.data[forKey]
    }
}

internal extension PXCheckoutStore {
    func clean() {
        removeAll()
        checkoutPreference = nil
        paymentDatas = []
    }
}
