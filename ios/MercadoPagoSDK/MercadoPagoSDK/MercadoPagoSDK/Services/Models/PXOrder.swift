//
//  PXOrder.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXOrder: NSObject, Codable {

    open var id: String!
    open var type: String?

    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    open class func fromJSONToPXOrder(data: Data) throws -> PXOrder {
        return try JSONDecoder().decode(PXOrder.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXOrder] {
        return try JSONDecoder().decode([PXOrder].self, from: data)
    }
}
