//
//  PXDiscountParamsConfiguration.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 10/12/2018.
//

import UIKit

@objcMembers
open class PXDiscountParamsConfiguration: NSObject, Codable {
    let labels: [String]
    let productId: String

    /**
     Set additional data needed to apply a specific discount.
     - parameter labels: Additional data needed to apply a specific discount.
     - parameter productId: Let us to enable discounts for the product id specified.
     */
    public init(labels: [String], productId: String) {
        self.labels = labels
        self.productId = productId
    }

    public enum PXDiscountParamsConfigCodingKeys: String, CodingKey {
        case labels
        case productId = "product_id"
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXDiscountParamsConfigCodingKeys.self)
        try container.encodeIfPresent(self.labels, forKey: .labels)
        try container.encodeIfPresent(self.productId, forKey: .productId)
    }
}
