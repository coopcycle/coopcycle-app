//
//  PXItem.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/**
 * Model object representing the Item.
 */
@objcMembers
open class PXItem: NSObject, Codable {
    /// :nodoc:
    open var categoryId: String?
    /// :nodoc:
    open var currencyId: String?
    /// :nodoc:
    open var _description: String?
    /// :nodoc:
    open var id: String!
    /// :nodoc:
    open var pictureUrl: String?
    /// :nodoc:
    open var quantity: Int = 0
    /// :nodoc:
    open var title: String = ""
    /// :nodoc:
    open var unitPrice: Double = 0

    // MARK: Init.
    /**
     Builder for item construction.
     It should be used when checkout initialize without a preference id and
     it is initialize with a preference created programmatically.
     - parameter title: Item title.
     - parameter quantity: Item quantity.
     - parameter unitPrice: Item price.
     */
    public init(title: String, quantity: Int, unitPrice: Double) {
        self.title = title
        self.quantity = quantity
        self.unitPrice = unitPrice
        self.id = ""
    }

    internal init(categoryId: String?, currencyId: String?, description: String?, id: String, pictureUrl: String?, quantity: Int, title: String, unitPrice: Double) {
        self.categoryId = categoryId
        self.currencyId = currencyId
        self._description = description
        self.id = id
        self.pictureUrl = pictureUrl
        self.quantity = quantity
        self.title = title
        self.unitPrice = unitPrice
    }

    /// :nodoc:
    public enum PXItemKeys: String, CodingKey {
        case categoryId = "category_id"
        case currencyId = "currency_id"
        case description = "description"
        case id
        case pictureUrl = "picture_url"
        case quantity
        case title
        case unitPrice = "unit_price"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXItemKeys.self)
        let categoryId: String? = try container.decodeIfPresent(String.self, forKey: .categoryId)
        let currencyId: String? = try container.decodeIfPresent(String.self, forKey: .currencyId)
        let description: String? = try container.decodeIfPresent(String.self, forKey: .description)
        let id: String = try container.decode(String.self, forKey: .id)
        let pictureUrl: String? = try container.decodeIfPresent(String.self, forKey: .pictureUrl)
        let title: String = try container.decodeIfPresent(String.self, forKey: .title) ?? ""
        let unitPrice: Double = try container.decodeIfPresent(Double.self, forKey: .unitPrice) ?? 0
        let quantity: Int = try container.decodeIfPresent(Int.self, forKey: .quantity) ?? 0

        self.init(categoryId: categoryId, currencyId: currencyId, description: description, id: id, pictureUrl: pictureUrl, quantity: quantity, title: title, unitPrice: unitPrice)
    }

    /// :nodoc:
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXItemKeys.self)
        try container.encodeIfPresent(self.categoryId, forKey: .categoryId)
        try container.encodeIfPresent(self.currencyId, forKey: .currencyId)
        try container.encodeIfPresent(self._description, forKey: .description)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.pictureUrl, forKey: .pictureUrl)
        try container.encodeIfPresent(self.title, forKey: .title)
        try container.encodeIfPresent(PXAmountHelper.getRoundedAmountAsNsDecimalNumber(amount: self.unitPrice, forInit: true).decimalValue, forKey: .unitPrice)
        try container.encodeIfPresent(self.quantity, forKey: .quantity)
    }

    /// :nodoc:
    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    /// :nodoc:
    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    /// :nodoc:
    open class func fromJSONToPXItem(data: Data) throws -> PXItem {
        return try JSONDecoder().decode(PXItem.self, from: data)
    }

    /// :nodoc:
    open class func fromJSON(data: Data) throws -> [PXItem] {
        return try JSONDecoder().decode([PXItem].self, from: data)
    }

}

// MARK: Setters
extension PXItem {
    /**
     setId
     - parameter id: ID.
     */
    open func setId(id: String) {
        self.id = id
    }

    /**
     setDescription
     - parameter description: Description.
     */
    open func setDescription(description: String) {
        self._description = description
    }

    /**
     setPictureURL
     - parameter url: Url remote picture.
     */
    open func setPictureURL(url: String) {
        self.pictureUrl = url
    }

    /**
     setCategoryId
     - parameter categoryId: Category id.
     */
    open func setCategoryId(categoryId: String) {
        self.categoryId = categoryId
    }
}

// MARK: Getters
extension PXItem {
    /**
     getQuantity
     */
    open func getQuantity() -> Int {
        return quantity
    }

    /**
     getUnitPrice
     */
    open func getUnitPrice() -> Double {
        return unitPrice
    }

    /**
     getTitle
     */
    open func getTitle() -> String {
        return title
    }

    /**
     getId
     */
    open func getId() -> String? {
        return id
    }

    /**
     getDescription
     */
    open func getDescription() -> String? {
        return _description
    }

    /**
     getCategoryId
     */
    open func getCategoryId() -> String? {
        return categoryId
    }

    /**
     getPictureURL
     */
    open func getPictureURL() -> String? {
        return pictureUrl
    }
}
