//
//  PXCreditsExpectationProps.swift
//  MercadoPagoSDK
//
//  Created by Federico Bustos Fierro on 16/5/18.
//  Copyright © 2019 MercadoPago. All rights reserved.
//

import Foundation

final class PXCreditsExpectationProps: NSObject {
    let title: String
    let subtitle: String

    public init(title: String, subtitle: String) {
        self.title = title
        self.subtitle = subtitle
    }
}
