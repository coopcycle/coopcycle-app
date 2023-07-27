//
//  String+Additions.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 29/12/14.
//  Copyright (c) 2014 com.mercadopago. All rights reserved.
//

import Foundation

internal extension String {

    static let NON_BREAKING_LINE_SPACE = "\u{00a0}"
    static let SPACE = " "

    static func isNullOrEmpty(_ value: String?) -> Bool {
        return value == nil || value!.isEmpty
    }

    func existsLocalized() -> Bool {
        let localizedString = self.localized
        return localizedString != self
    }

    static func isDigitsOnly(_ number: String) -> Bool {
		if Regex("^[0-9]*$").test(number) {
			return true
		} else {
			return false
		}
    }

    func startsWith(_ prefix: String) -> Bool {
        if prefix == self {
            return true
        }
        let startIndex = self.range(of: prefix)
        if startIndex == nil || self.startIndex != startIndex?.lowerBound {
            return false
        }
        return true
    }

    func lastCharacters(number: Int) -> String {
        let trimmedString: String = (self as NSString).substring(from: max(self.count - number, 0))
        return trimmedString
    }

    func indexAt(_ theInt: Int) ->String.Index {
        return self.index(self.startIndex, offsetBy: theInt)
    }

    func trimSpaces() -> String {
        var stringTrimmed = self.replacingOccurrences(of: " ", with: "")
        stringTrimmed = stringTrimmed.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        return stringTrimmed
    }

    mutating func paramsAppend(key: String, value: String?) {
        if !key.isEmpty && !String.isNullOrEmpty(value) {
            if self.isEmpty {
                self = key + "=" + value!
            } else {
                self += "&" + key + "=" + value!
            }
        }
    }

    func toAttributedString(attributes: [NSAttributedString.Key: Any]? = nil) -> NSMutableAttributedString {
        return NSMutableAttributedString(string: self, attributes: attributes)
    }

    func getAttributedStringNewLine() -> NSMutableAttributedString {
        return "\n".toAttributedString()
    }

    static func getDate(_ string: String?) -> Date? {
        guard let dateString = string else {
            return nil
        }
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"
        return dateFormatter.date(from: dateString)
    }

    var isNumber: Bool {
        return rangeOfCharacter(from: CharacterSet.decimalDigits.inverted) == nil
    }
}
