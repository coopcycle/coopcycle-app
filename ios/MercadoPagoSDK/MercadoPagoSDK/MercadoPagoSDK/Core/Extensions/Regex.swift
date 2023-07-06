//
//  Regex.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 30/1/15.
//  Copyright (c) 2015 com.mercadopago. All rights reserved.
//

import Foundation

@objcMembers
internal class Regex {
    let internalExpression: NSRegularExpression?
    let pattern: String

    init(_ pattern: String) {
        self.pattern = pattern
		do {
			self.internalExpression = try NSRegularExpression(pattern: pattern, options: [NSRegularExpression.Options.caseInsensitive])
		} catch {
			self.internalExpression = nil
		}
    }

    func test(_ input: String) -> Bool {
		if self.internalExpression != nil {
            let matches = self.internalExpression!.matches(in: input, options: [], range: NSRange(location: 0, length: input.count))
			return matches.count > 0
		} else {
			return false
		}
    }
}
