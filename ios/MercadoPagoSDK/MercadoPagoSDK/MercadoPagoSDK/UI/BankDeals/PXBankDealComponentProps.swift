//
//  PXBankDealComponentProps.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

class PXBankDealComponentProps: NSObject {
    let imageUrl: String?
    let placeholder: String?
    let title: String?
    let subtitle: String?

    init(imageUrl: String?, placeholder: String?, title: String?, subtitle: String?) {
        self.imageUrl = imageUrl
        self.title = title
        self.subtitle = subtitle
        self.placeholder = placeholder
    }
}
