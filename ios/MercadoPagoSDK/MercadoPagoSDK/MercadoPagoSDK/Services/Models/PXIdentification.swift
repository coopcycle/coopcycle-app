//
//  PXIdentification.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXIdentification: NSObject, Codable {

    open var number: String? = "null"
    open var type: String? = "null"

    open var isComplete: Bool {
        get {
            return number != "null" && type != "null" && number != "" && type != ""
        }
    }

    public init(number: String?, type: String?) {
        self.type = type
        self.number = number
    }

    public init (identificationType: PXIdentificationType, identificationNumber: String) {
        self.type = identificationType.name
        self.number = identificationNumber
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

    open class func fromJSONToPXIdentification(data: Data) throws -> PXIdentification {
        return try JSONDecoder().decode(PXIdentification.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXIdentification] {
        return try JSONDecoder().decode([PXIdentification].self, from: data)
    }
}
