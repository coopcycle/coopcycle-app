//
//  PXCardNumber.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXCardNumber: NSObject, Codable {
    open var length: Int = 0
    open var validation: String?

    public init(length: Int, validation: String?) {
        self.length = length
        self.validation = validation
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

    open class func fromJSONToPXCardNumber(data: Data) throws -> PXCardNumber {
        return try JSONDecoder().decode(PXCardNumber.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXCardNumber] {
        return try JSONDecoder().decode([PXCardNumber].self, from: data)
    }

}
