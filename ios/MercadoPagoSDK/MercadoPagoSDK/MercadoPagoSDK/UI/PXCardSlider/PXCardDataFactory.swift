//
//  PXCardDataFactory.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/10/18.
//

import Foundation
import MLCardDrawer

internal class PXCardDataFactory: NSObject, CardData {
    var name = ""
    var number = ""
    var securityCode = ""
    var expiration = ""

    func create(cardName: String, cardNumber: String, cardCode: String, cardExpiration: String, cardPattern: [Int]? = nil) -> PXCardDataFactory {
        self.name = cardName
        if let pattern = cardPattern {
            let cardNumberLenght: Int = cardNumber.count
            var fullCardLenght: Int = 0
            for pat in pattern {
                fullCardLenght += pat
            }
            var finalCardNumber: String = ""
            for _ in 1...(fullCardLenght - cardNumberLenght) {
                finalCardNumber += "*"
            }
            finalCardNumber += "\(cardNumber)"
            self.number = finalCardNumber
        } else {
            self.number = cardNumber
        }
        self.securityCode = cardCode
        self.expiration = cardExpiration
        return self
    }
}
