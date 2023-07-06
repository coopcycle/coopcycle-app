//
//  PXPayer.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
@objcMembers
open class PXPayer: NSObject, Codable, NSCopying {

    open var id: String?
    open var accessToken: String?
    open var identification: PXIdentification?
    open var type: String?
    open var entityType: String?
    open var email: String = ""
    open var firstName: String?
    open var lastName: String?
    open var legalName: String?

    public init(id: String?, accessToken: String?, identification: PXIdentification?, type: String?, entityType: String?, email: String, firstName: String?, lastName: String?, legalName: String? = nil) {
        self.id = id
        self.accessToken = accessToken
        self.identification = identification
        self.type = type
        self.entityType = entityType
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        //hack for money in first integration, if no legal name has been set, first name is used as such
        self.legalName = legalName ?? firstName
    }

    public init(email: String) {
        self.email = email
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXPayerKeys.self)
        let accessToken: String? = try container.decodeIfPresent(String.self, forKey: .accessToken)
        let type: String? = try container.decodeIfPresent(String.self, forKey: .type)
        let email: String = try container.decodeIfPresent(String.self, forKey: .email) ?? ""
        let id: String? = try container.decodeIfPresent(String.self, forKey: .id)
        let entityType: String? = try container.decodeIfPresent(String.self, forKey: .entityType)
        let firstName: String? = try container.decodeIfPresent(String.self, forKey: .firstName)
        let lastName: String? = try container.decodeIfPresent(String.self, forKey: .lastName)
        let legalName: String? = try container.decodeIfPresent(String.self, forKey: .legalName)
        let identification: PXIdentification? = try container.decodeIfPresent(PXIdentification.self, forKey: .identification)

        self.init(id: id, accessToken: accessToken, identification: identification, type: type, entityType: entityType, email: email, firstName: firstName, lastName: lastName, legalName: legalName)
    }

    /// :nodoc:
    public func copy(with zone: NSZone? = nil) -> Any {
        let copyObj = PXPayer(email: self.email)
        copyObj.id = id
        copyObj.accessToken = accessToken
        copyObj.identification = identification
        copyObj.type = type
        copyObj.entityType = entityType
        copyObj.email = email
        copyObj.firstName = firstName
        copyObj.lastName = lastName
        return copyObj
    }
}

/** :nodoc: */
// MARK: Setters
extension PXPayer {
    open func setId(payerId: String) {
        self.id = payerId
    }

    open func setIdentification(identification: PXIdentification) {
        self.identification = identification
    }

    open func setEntityType(entityType: String) {
        self.entityType = entityType
    }

    open func setFirstName(name: String) {
        self.firstName = name
    }

    open func setLastName(lastName: String) {
        self.lastName = lastName
    }

    open func setLegalName(lastName: String) {
        self.legalName = lastName
    }

    internal func setAccessToken(accessToken: String) {
        self.accessToken = accessToken
    }
}

/** :nodoc: */
// MARK: Getters
extension PXPayer {
    @objc
    open func getEmail() -> String {
        return email
    }

    @objc
    open func getId() -> String? {
        return id
    }

    @objc
    open func getIdentification() -> PXIdentification? {
        return identification
    }

    @objc
    open func getEntityType() -> String? {
        return entityType
    }

    @objc
    open func getFirstName() -> String? {
        return firstName
    }

    @objc
    open func getLastName() -> String? {
        return lastName
    }

    @objc
    open func getLegalName() -> String? {
        return legalName
    }

    internal func getAccessToken() -> String? {
        return accessToken
    }
}

/** :nodoc: */
// MARK: JSON
extension PXPayer {
    public enum PXPayerKeys: String, CodingKey {
        case id
        case accessToken = "access_token"
        case identification = "identification"
        case type
        case entityType = "entity_type"
        case email = "email"
        case firstName = "name"
        case lastName = "surname"
        case legalName = "legal_name"
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXPayerKeys.self)
        if !String.isNullOrEmpty(accessToken) {
            try container.encodeIfPresent(self.accessToken, forKey: .accessToken)
        }
        try container.encodeIfPresent(self.type, forKey: .type)
        try container.encodeIfPresent(self.email, forKey: .email)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.entityType, forKey: .entityType)
        var name: String? = nil
        //if "first name" or "legal name" variable is present, it's expected to be sent using "first_name" as key; in the unexpected case where both fields have an assigned value, "legal name" is prioritized to use the aformentioned key
        if let firstName = self.firstName, !firstName.isEmpty {
            name = firstName
        }
        if let legalName = self.legalName, !legalName.isEmpty {
            name = legalName
        }
        try container.encodeIfPresent(name, forKey: .firstName)
        try container.encodeIfPresent(self.lastName, forKey: .lastName)
        try container.encodeIfPresent(self.identification, forKey: .identification)
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

    open class func fromJSON(data: Data) throws -> PXPayer {
        return try JSONDecoder().decode(PXPayer.self, from: data)
    }
}
