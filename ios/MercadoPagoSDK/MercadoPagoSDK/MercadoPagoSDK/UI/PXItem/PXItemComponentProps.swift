//
//  PXItemComponentProps.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 3/6/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXItemComponentProps: NSObject {
    var imageURL: String?
    var title: String?
    var itemDescription: String?
    var quantity: Int?
    var unitAmount: Double?
    let amountTitle: String
    let quantityTitle: String
    let collectorImage: UIImage?
    let backgroundColor: UIColor
    let boldLabelColor: UIColor
    let lightLabelColor: UIColor

    typealias ItemTheme = (backgroundColor: UIColor, boldLabelColor: UIColor, lightLabelColor: UIColor)

    init(imageURL: String?, title: String?, description: String?, quantity: Int?, unitAmount: Double?, amountTitle: String, quantityTitle: String, collectorImage: UIImage?, itemTheme: ItemTheme) {
        self.imageURL = imageURL
        self.title = title
        self.itemDescription = description
        self.quantity = quantity
        self.unitAmount = unitAmount
        self.amountTitle = amountTitle
        self.quantityTitle = quantityTitle
        self.collectorImage = collectorImage
        self.backgroundColor = itemTheme.backgroundColor
        self.boldLabelColor = itemTheme.boldLabelColor
        self.lightLabelColor = itemTheme.lightLabelColor
    }
}
