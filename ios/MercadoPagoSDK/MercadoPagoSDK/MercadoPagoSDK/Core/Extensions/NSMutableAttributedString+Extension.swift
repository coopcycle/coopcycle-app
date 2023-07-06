//
//  NSMutableAttributedString+Extension.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 16/09/2019.
//

import Foundation

extension NSMutableAttributedString {
    func appendWithSpace(_ string: NSAttributedString) {
        self.append(" ".toAttributedString())
        self.append(string)
    }
}
