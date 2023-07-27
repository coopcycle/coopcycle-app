//
//  PXCustomer.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXCustomer: NSObject, Codable {
    open var address: PXAddress?
    open var cards: [PXCard]?
    open var defaultCard: String?
    open var _description: String?
    open var dateCreated: Date?
    open var dateLastUpdated: Date?
    open var email: String?
    open var firstName: String?
    open var id: String!
    open var identification: PXIdentification?
    open var lastName: String?
    open var liveMode: Bool?
    open var metadata: [String: String]?
    open var phone: PXPhone?
    open var registrationDate: Date?

    public init(address: PXAddress?, cards: [PXCard]?, defaultCard: String?, description: String?, dateCreated: Date?, dateLastUpdated: Date?, email: String?, firstName: String?, id: String, identification: PXIdentification?, lastName: String?, liveMode: Bool?, metadata: [String: String]?, phone: PXPhone?, registrationDate: Date?) {

        self.address = address
        self.cards = cards
        self.defaultCard = defaultCard
        self._description = description
        self.dateCreated = dateCreated
        self.dateLastUpdated = dateLastUpdated
        self.email = email
        self.firstName = firstName
        self.id = id
        self.identification = identification
        self.lastName = lastName
        self.liveMode = liveMode
        self.metadata = metadata
        self.phone = phone
        self.registrationDate = registrationDate
    }

    public enum PXCustomerKeys: String, CodingKey {
        case address
        case cards
        case defaultCard = "default_card"
        case _description = "description"
        case dateCreated = "date_created"
        case dateLastUpdated =  "date_last_updated"
        case email
        case firstName = "first_name"
        case id
        case identification
        case lastName = "last_name"
        case liveMode = "live_mode"
        case metadata
        case phone
        case registrationDate = "registration_date"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXCustomerKeys.self)
        let address: PXAddress? = try container.decodeIfPresent(PXAddress.self, forKey: .address)
        let cards: [PXCard]? = try container.decodeIfPresent([PXCard].self, forKey: .cards)
        let defaultCard: String? = try container.decodeIfPresent(String.self, forKey: .defaultCard)
        let _description: String? = try container.decodeIfPresent(String.self, forKey: ._description)
        let dateLastUpdated: Date? = try container.decodeDateFromStringIfPresent(forKey: .dateLastUpdated)
        let dateCreated: Date? = try container.decodeDateFromStringIfPresent(forKey: .dateCreated)
        let email: String? = try container.decodeIfPresent(String.self, forKey: .email)
        let firstName: String? = try container.decodeIfPresent(String.self, forKey: .firstName)
        let id: String = try container.decode(String.self, forKey: .id)
        let identification: PXIdentification? = try container.decodeIfPresent(PXIdentification.self, forKey: .identification)
        let lastName: String? = try container.decodeIfPresent(String.self, forKey: .lastName)
        let liveMode: Bool? = try container.decodeIfPresent(Bool.self, forKey: .liveMode)
        let metadata: [String: String]? = try container.decodeIfPresent([String: String].self, forKey: .metadata)
        let phone: PXPhone? = try container.decodeIfPresent(PXPhone.self, forKey: .phone)
        let registrationDate: Date? = try container.decodeDateFromStringIfPresent(forKey: .registrationDate)

        self.init(address: address, cards: cards, defaultCard: defaultCard, description: _description, dateCreated: dateCreated, dateLastUpdated: dateLastUpdated, email: email, firstName: firstName, id: id, identification: identification, lastName: lastName, liveMode: liveMode, metadata: metadata, phone: phone, registrationDate: registrationDate)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXCustomerKeys.self)
        try container.encodeIfPresent(self.address, forKey: .address)
        try container.encodeIfPresent(self.cards, forKey: .cards)
        try container.encodeIfPresent(self.defaultCard, forKey: .defaultCard)
        try container.encodeIfPresent(self._description, forKey: ._description)
        try container.encodeIfPresent(self.dateLastUpdated, forKey: .dateLastUpdated)
        try container.encodeIfPresent(self.dateCreated, forKey: .dateCreated)
        try container.encodeIfPresent(self.email, forKey: .email)
        try container.encodeIfPresent(self.firstName, forKey: .firstName)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.identification, forKey: .identification)
        try container.encodeIfPresent(self.lastName, forKey: .lastName)
        try container.encodeIfPresent(self.liveMode, forKey: .liveMode)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encodeIfPresent(self.phone, forKey: .phone)
        try container.encodeIfPresent(self.registrationDate, forKey: .registrationDate)
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

    open class func fromJSONToPXCustomer(data: Data) throws -> PXCustomer {
        return try JSONDecoder().decode(PXCustomer.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXCustomer] {
        return try JSONDecoder().decode([PXCustomer].self, from: data)
    }
}
