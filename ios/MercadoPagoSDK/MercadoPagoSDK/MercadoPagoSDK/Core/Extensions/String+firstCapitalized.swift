//
//  String+firstCapitalized.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 15/01/2020.
//

import Foundation

extension String {
    var firstCapitalized: String {
        return prefix(1).uppercased() + dropFirst()
    }
}
