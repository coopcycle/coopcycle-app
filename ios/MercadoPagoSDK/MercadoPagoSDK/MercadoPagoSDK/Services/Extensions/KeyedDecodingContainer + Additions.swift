//
//  KeyedDecodingContainer + Additions.swift
//  MercadoPagoServices
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/6/18.
//  Copyright © 2018 Mercado Pago. All rights reserved.
//

import Foundation

internal extension KeyedDecodingContainer {
    func decodeDateFromStringIfPresent(forKey key: K) throws -> Date? {
        let stringDate = try self.decodeIfPresent(String.self, forKey: key)
        let date = String.getDate(stringDate)
        return date
    }
}
