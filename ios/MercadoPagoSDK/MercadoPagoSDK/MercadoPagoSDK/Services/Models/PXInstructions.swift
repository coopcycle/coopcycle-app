//
//  PXInstructions.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXInstructions: NSObject, Codable {
    open var amountInfo: PXAmountInfo?
    open var instructions: [PXInstruction] = []

    public init(amountInfo: PXAmountInfo?, instructions: [PXInstruction]) {
        self.amountInfo = amountInfo
        self.instructions = instructions
    }

    public enum PXInstructionsKeys: String, CodingKey {

        case amountInfo = "amount_info"
        case instructions
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXInstructionsKeys.self)
        let amountInfo: PXAmountInfo? = try container.decodeIfPresent(PXAmountInfo.self, forKey: .amountInfo)
        let instructions: [PXInstruction] = try container.decodeIfPresent([PXInstruction].self, forKey: .instructions) ?? []

        self.init(amountInfo: amountInfo, instructions: instructions)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXInstructionsKeys.self)
        try container.encodeIfPresent(self.amountInfo, forKey: .amountInfo)
        try container.encodeIfPresent(self.instructions, forKey: .instructions)
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

    open class func fromJSON(data: Data) throws -> PXInstructions {
        return try JSONDecoder().decode(PXInstructions.self, from: data)
    }
}
