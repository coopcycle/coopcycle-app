//
//  Date+Additions.swift
//  MercadoPagoPXTracking
//
//  Created by Eden Torres on 3/12/18.
//  Copyright © 2018 Mercado Pago. All rights reserved.
//

import Foundation
internal extension Date {
    func getCurrentMillis() -> Int64 {
        return Int64(self.timeIntervalSince1970 * 1000)
    }
    
    func from(millis: Int64) -> Date {
        let timeInterval: TimeInterval = Double(millis) / 1000
        return Date(timeIntervalSince1970: timeInterval)
    }
    
    func stringDate() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        return dateFormatter.string(from: self)
    }
}
