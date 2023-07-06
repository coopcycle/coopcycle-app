//
//  TextMaskFormater.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 8/16/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

internal class TextMaskFormater {

    var mask: String!
    open var characterSpace: Character! = "X"
    open var emptyMaskElement: Character! = "•"
    var completeEmptySpaces: Bool = true
    var leftToRight: Bool = true
    var unmask : (( _ textToUnmask: String) -> String)?

    init(mask: String!, completeEmptySpaces: Bool = true, leftToRight: Bool = true, completeEmptySpacesWith: Character? = "•") {
        self.mask = mask
        self.completeEmptySpaces = completeEmptySpaces
        self.leftToRight = leftToRight
        self.emptyMaskElement = completeEmptySpacesWith
    }

    func textMasked(_ text: String!, remasked: Bool = false) -> String! {
        if remasked {
            return textMasked(textUnmasked(text))
        }
        if text.count == 0 {
            return self.emptyTextMasked()
        }
        return self.maskText(text)
    }

    func textUnmasked(_ text: String!) -> String! {
        if unmask != nil {
            return unmask!(text)
        } else {
            let charset: Set<Character> = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            var ints: String = ""
            for char: Character in text {
                if charset.contains(char) || isLetter(char)  {
                    ints.append(char)
                }
            }
            return ints
        }
    }

    private func isLetter(_ char: Character) -> Bool {
        return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") ? true : false
    }

    private func emptyTextMasked() -> String! {
        if completeEmptySpaces {
            return (mask?.replacingOccurrences(of: String(characterSpace), with: String(emptyMaskElement)))!
        } else {
            return ""
        }
    }

    private func replaceEmpySpot(_ text: String!) -> String! {
        return (text.replacingOccurrences(of: String(characterSpace), with: String(emptyMaskElement)))
    }

    private func maskText(_ text: String!) -> String! {
        let maskArray = Array(mask)
        var textToMask = text
        if (!leftToRight) && (completeEmptySpaces) {
            textToMask = completeWithEmptySpaces(text)
        }
        let textArray = Array(textToMask!)
        var resultString: String = ""
        var charText: Character! = textArray[0]
        var charMask: Character!
        if !self.completeEmptySpaces && (textToMask?.count == 0) {
            return ""
        }

        var indexMask = 0
        var indexText = 0
        while (indexMask < maskArray.count) && (self.completeEmptySpaces || (textArray.count>indexText)) {

             charMask = maskArray[indexMask]

            if textArray.count > indexText {
                charText = textArray[indexText]
            } else {
                charText = nil
            }

            if charText == nil {
                resultString.append(String(charMask))
                indexMask += 1
            } else if String(charMask) != String(characterSpace) {
                resultString.append(String(charMask))
                indexMask += 1
            } else {
                 resultString.append(String(charText))
                indexMask += 1
                indexText += 1
            }
        }
        return self.replaceEmpySpot(resultString)
    }

    private func completeWithEmptySpaces(_ text: String) -> String {
        let charset: Set<Character> = [characterSpace]
        var str: String = ""
        for char: Character in mask {
            if charset.contains(char) {
                str.append(char)
            }
        }
        var max = str.count - text.count
        let spaceChar: Character = characterSpace
        if max < 0 {
           max = 0
        }
        return (String(repeating: String(spaceChar), count: max) + text)
    }

    private func stringByChoose(_ maskCharacter: Character, textCharacter: Character!) -> String {
        if textCharacter == nil {
            return String(maskCharacter)
        }
        if String(maskCharacter) != String(characterSpace) {
            return String(maskCharacter) + String(textCharacter)
        }
        return String(textCharacter)
    }
}

internal struct Number {
    static let formatterWithSepator: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.groupingSeparator = "."
        formatter.numberStyle = .decimal
        return formatter
    }()
}
