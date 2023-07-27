//
//  Updatable.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 3/9/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

@objc internal protocol Updatable {
    func updateCard(token: PXCardInformationForm?, paymentMethod: PXPaymentMethod)
    func setCornerRadius(radius: CGFloat)
}
