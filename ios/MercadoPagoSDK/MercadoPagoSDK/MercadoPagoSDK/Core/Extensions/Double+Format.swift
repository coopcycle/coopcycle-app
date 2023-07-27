//
//  Double+Format.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 3/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal extension Double {
    var cleanString: String {
        return self.truncatingRemainder(dividingBy: 1) == 0 ? String(format: "%.0f", self) : String(self)
    }
}
