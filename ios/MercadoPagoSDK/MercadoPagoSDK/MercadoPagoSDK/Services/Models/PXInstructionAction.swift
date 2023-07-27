//
//  PXInstructionAction.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXInstructionAction: NSObject, Codable {

    open var label: String?
    open var url: String?
    open var tag: String?
    open var content: String?

    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    open class func fromJSONToPXInstructionAction(data: Data) throws -> PXInstructionAction {
        return try JSONDecoder().decode(PXInstructionAction.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXInstructionAction] {
        return try JSONDecoder().decode([PXInstructionAction].self, from: data)
    }

}
