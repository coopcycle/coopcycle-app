//
//  PXDeviceId.swift
//  MercadoPagoServices
//
//  Created by Eden Torres on 10/27/17.
//  Copyright © 2017 Mercado Pago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXDeviceId: NSObject, Codable {
    open var name: String!
    open var value: String!

    public init(name: String, value: String) {
        self.name = name
        self.value = value
    }

    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    open class func fromJSONToPXDeviceId(data: Data) throws -> PXDeviceId {
        return try JSONDecoder().decode(PXDeviceId.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXDeviceId] {
        return try JSONDecoder().decode([PXDeviceId].self, from: data)
    }
}
