//
//  PXUIImage.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 10/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXUIImage: UIImage {
    var url: String?
    var placeholder: String?
    var fallback: String?

    convenience init(url: String?, placeholder: String? = nil, fallback: String? = nil) {
        self.init()
        self.url = url
        self.placeholder = placeholder
        self.fallback = fallback
    }
}
