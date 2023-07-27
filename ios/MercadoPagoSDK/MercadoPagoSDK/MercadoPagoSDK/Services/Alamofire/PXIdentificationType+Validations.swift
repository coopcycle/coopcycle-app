//
//  PXIdentificationType+Validations.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 13/2/19.
//

import Foundation

internal enum Status {
    case valid
    case wrongLength
    case repeatedPattern
    case commonNumber
    case invalid
}

internal struct ValidationOptions: OptionSet {
    public let rawValue: Int

    public init(rawValue: Int) {
        self.rawValue = rawValue
    }

    public static let addLeadingZeros = ValidationOptions(rawValue: 1 << 0)
    public static let ignoreRemainingCharacters = ValidationOptions(rawValue: 1 << 1)
    public static let interpretOnlyNumbers = ValidationOptions(rawValue: 1 << 2)
    public static let allowRepeatedPatterns = ValidationOptions(rawValue: 1 << 3)
    public static let allowCommonNumbers = ValidationOptions(rawValue: 1 << 4)
}

internal enum Kind {
    case CPF
    case CNPJ

    var length: Int {
        switch self {
        case .CPF: return 11
        case .CNPJ: return 14
        }
    }
}

internal protocol Validator {
    associatedtype T

    func validate(cpf: String, options: ValidationOptions) -> T
    func validate(cnpj: String, options: ValidationOptions) -> T

    func validate(_ string: String, kind: Kind, options: ValidationOptions) -> T
}

extension Validator {
    public func validate(cpf: String, options: ValidationOptions = []) -> T {
        return validate(cpf, kind: .CPF, options: options)
    }

    public func validate(cnpj: String, options: ValidationOptions = []) -> T {
        return validate(cnpj, kind: .CNPJ, options: options)
    }
}

internal struct StatusValidator: Validator {

    public init() { }

    public func validate(_ string: String, kind: Kind, options: ValidationOptions = []) -> Status {
        guard isValid(string, options: options) else { return .invalid }

        let desiredLength = kind.length
        let cleanString = clean(string, options: options, length: desiredLength)

        guard cleanString.count == desiredLength else { return .wrongLength }

        guard options.contains(.allowRepeatedPatterns) ||
            !isRepeatedPattern(cleanString) else {
                return .repeatedPattern
        }

        guard options.contains(.allowCommonNumbers) ||
            !isCommonNumber(cleanString) else {
                return .commonNumber
        }

        return validate(cleanString, kind: kind) ? .valid : .invalid
    }
}

internal struct IdentificationTypeValidator: Validator {

    public init() { }

    let statusValidator = StatusValidator()
    public func validate(_ string: String, kind: Kind, options: ValidationOptions = []) -> Bool {
        let validationStatus = statusValidator.validate(string, kind: kind, options: options)

        return validationStatus == .valid
    }

    public func filterSupported(identificationTypes: [PXIdentificationType]?) -> [PXIdentificationType]? {
        guard let identificationTypes = identificationTypes else {
            return nil
        }
        if let site = SiteManager.shared.getSite(), site.id == "MLB" {
            return identificationTypes.filter { $0.id == BoletoType.cpf.rawValue }
        }
        return identificationTypes
    }
}

fileprivate extension Validator {
    func isValid(_ string: String, options: ValidationOptions) -> Bool {
        guard !options.contains(.interpretOnlyNumbers) else { return true }

        let characters = string.map { String($0) }
        let allowedCharacterSet = CharacterSet(charactersIn: "0123456789-./")
        let charactersRemovingAllowedCharacters = characters.filter {
            $0.rangeOfCharacter(from: allowedCharacterSet) == nil
        }

        return charactersRemovingAllowedCharacters.count == 0
    }

    func clean(_ string: String, options: ValidationOptions, length: Int) -> [Int] {
        let characters = string.map { String($0) }
        let numbers = characters.map { Int($0) }.compactMap { $0 }

        let count = numbers.count

        if count > length && options.contains(.ignoreRemainingCharacters) {
            return Array(numbers[0..<length])
        } else if count < length && options.contains(.addLeadingZeros) {
            let zerosToAdd = length - count
            let zeros = Array(repeatElement(0, count: zerosToAdd))
            return zeros + numbers
        }

        return numbers
    }

    func isRepeatedPattern(_ numbers: [Int]) -> Bool {
        return Set(numbers).count <= 1
    }

    func isCommonNumber(_ numbers: [Int]) -> Bool {
        let number = numbers.map { String($0) }.reduce("", +)
        let commonNumbers = ["12345678909"]

        return commonNumbers.contains(number)
    }

    func validate(_ numbers: [Int], kind: Kind) -> Bool {
        switch kind {
        case .CPF:
            guard numbers.count == 11 else { return false }
            let digits = Array(numbers[0..<9])
            let firstDigit = checkDigit(for: digits, upperBound: 9, lowerBound: 0, mod: 11)
            let secondDigit = checkDigit(for: digits + [firstDigit], upperBound: 9, lowerBound: 0, mod: 11)

            return firstDigit == numbers[9] && secondDigit == numbers[10]
        case .CNPJ:
            guard numbers.count == 14 else { return false }
            let digits = Array(numbers[0..<12])
            let firstDigit = checkDigit(for: digits, upperBound: 9, lowerBound: 2, mod: 11)
            let secondDigit = checkDigit(for: digits + [firstDigit], upperBound: 9, lowerBound: 2, mod: 11)

            return firstDigit == numbers[12] && secondDigit == numbers[13]
        }
    }

    private func checkDigit(for digits: [Int], upperBound: Int, lowerBound: Int, mod: Int, secondMod: Int = 10) -> Int {
        guard lowerBound < upperBound else { preconditionFailure("lower bound is greater than upper bound") }

        let factors = Array((lowerBound...upperBound).reversed())

        let multiplied = digits.reversed().enumerated().map {
            return $0.element * factors[$0.offset % factors.count]
        }

        let sum = multiplied.reduce(0, +)

        return (sum % mod) % secondMod
    }
}
