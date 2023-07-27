//
//  PXCardHolder.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXCardHolder: NSObject, Codable {

    open var name: String?
    open var identification: PXIdentification?

    public init(name: String?, identification: PXIdentification?) {
        self.identification = identification
        self.name = name
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

    open class func fromJSONToPXCardHolder(data: Data) throws -> PXCardHolder {
        return try JSONDecoder().decode(PXCardHolder.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXCardHolder] {
        return try JSONDecoder().decode([PXCardHolder].self, from: data)
    }

}
