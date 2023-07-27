//
//  PXInstruction.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXInstruction: NSObject, Codable {
    open var title: String = ""
    open var subtitle: String?
    open var accreditationMessage: String?
    open var accreditationComments: [String] = []
    open var actions: [PXInstructionAction]?
    open var type: String?
    open var references: [PXInstructionReference]?
    open var interactions: [PXInstructionInteraction]?
    open var secondaryInfo: [String]?
    open var tertiaryInfo: [String]?
    open var info: [String] = []

    public init(title: String, subtitle: String?, accreditationMessage: String?, accreditationComments: [String], actions: [PXInstructionAction]?, type: String?, references: [PXInstructionReference]?, interactions: [PXInstructionInteraction]?, secondaryInfo: [String]?, tertiaryInfo: [String]?, info: [String]) {
        self.title = title
        self.subtitle = subtitle
        self.accreditationMessage = accreditationMessage
        self.accreditationComments = accreditationComments
        self.actions = actions
        self.type = type
        self.references = references
        self.interactions = interactions
        self.secondaryInfo = secondaryInfo
        self.tertiaryInfo = tertiaryInfo
        self.info = info
    }

    public enum PXInstructionKeys: String, CodingKey {
        case title
        case subtitle
        case accreditationMessage = "accreditation_message"
        case accreditationComments = "accreditation_comments"
        case actions
        case type
        case references
        case interactions
        case secondaryInfo = "secondary_info"
        case tertiaryInfo = "tertiary_info"
        case info
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXInstructionKeys.self)
        let title: String = try container.decodeIfPresent(String.self, forKey: .title) ?? ""
        let subtitle: String? = try container.decodeIfPresent(String.self, forKey: .subtitle)
        let accreditationMessage: String? = try container.decodeIfPresent(String.self, forKey: .accreditationMessage)
        let accreditationComments: [String] = try container.decodeIfPresent([String].self, forKey: .accreditationComments) ?? []
        let action: [PXInstructionAction]? = try container.decodeIfPresent([PXInstructionAction].self, forKey: .actions)
        let type: String? = try container.decodeIfPresent(String.self, forKey: .type)
        let references: [PXInstructionReference]? = try container.decodeIfPresent([PXInstructionReference].self, forKey: .references)
        let interactions: [PXInstructionInteraction]? = try container.decodeIfPresent([PXInstructionInteraction].self, forKey: .interactions)
        let secondaryInfo: [String]? = try container.decodeIfPresent([String].self, forKey: .secondaryInfo)
        let tertiaryInfo: [String]? = try container.decodeIfPresent([String].self, forKey: .tertiaryInfo)
        let info: [String] = try container.decodeIfPresent([String].self, forKey: .info) ?? []

        self.init(title: title, subtitle: subtitle, accreditationMessage: accreditationMessage, accreditationComments: accreditationComments, actions: action, type: type, references: references, interactions: interactions, secondaryInfo: secondaryInfo, tertiaryInfo: tertiaryInfo, info: info)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXInstructionKeys.self)
        try container.encodeIfPresent(self.title, forKey: .title)
        try container.encodeIfPresent(self.subtitle, forKey: .subtitle)
        try container.encodeIfPresent(self.accreditationMessage, forKey: .accreditationMessage)
        try container.encodeIfPresent(self.accreditationComments, forKey: .accreditationComments)
        try container.encodeIfPresent(self.actions, forKey: .actions)
        try container.encodeIfPresent(self.type, forKey: .type)
        try container.encodeIfPresent(self.references, forKey: .references)
        try container.encodeIfPresent(self.interactions, forKey: .interactions)
        try container.encodeIfPresent(self.secondaryInfo, forKey: .secondaryInfo)
        try container.encodeIfPresent(self.tertiaryInfo, forKey: .tertiaryInfo)
        try container.encodeIfPresent(self.info, forKey: .info)
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

    open class func fromJSONToPXInstruction(data: Data) throws -> PXInstruction {
        return try JSONDecoder().decode(PXInstruction.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXInstruction] {
        return try JSONDecoder().decode([PXInstruction].self, from: data)
    }
}
