//
//  PXBusinessResult.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 8/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit
/**
 Possible Business Result Status:
 - APPROVED
 - REJECTED
 - PENDING
 - IN_PROGRESS
 */
@objc public enum PXBusinessResultStatus: Int {
    /**
     APPROVED payment.
     */
    case APPROVED
    /**
     REJECTED payment.
     */
    case REJECTED
    /**
     PENDING payment.
     */
    case PENDING
    /**
     IN_PROGRESS payment.
     */
    case IN_PROGRESS

    func getDescription() -> String {
        switch self {
        case .APPROVED : return "APPROVED"
        case .REJECTED  : return "REJECTED"
        case .PENDING   : return "PENDING"
        case .IN_PROGRESS : return "IN PROGRESS"
        }
    }
}

/**
 This class represents a business payment result.
 For example, when there is an error when making a payment that has to do with the business and not with the payment method.
 */
@objcMembers open class PXBusinessResult: NSObject, PXBasePayment {
    private let status: PXBusinessResultStatus // APPROVED REJECTED PENDING
    private let title: String // Titluo de Congrats
    private let subtitle: String? // Sub Titluo de Congrats
    private let icon: UIImage?  // Icono de Congrats
    private let mainAction: PXAction? // Boton principal (Azul)
    private let secondaryAction: PXAction? // Boton secundario (link)
    private let helpMessage: String? // Texto
    private let showPaymentMethod: Bool // Si quiere que muestre la celda de PM
    private let statementDescription: String?
    private let imageUrl: String?
    private let topCustomView: UIView?
    private let bottomCustomView: UIView?
    // Above crossSeling backend drive box.
    private var importantView: UIView?
    private var receiptId: String?
    private let paymentMethodId: String?
    private let paymentTypeId: String?
    let paymentStatus: String
    let paymentStatusDetail: String

    private var receiptIdList: [String]?
    private var shouldShowReceipt: Bool = true

    // MARK: Initialization
    /**
     Creates a `PXBusinessResult` which represents Business Payment Result.
     - parameter receiptId: Reference id for payment receipt.
     - parameter status: Business Status Result
     - parameter title: Title that will be displayed on the result screen
     - parameter subtitle: Sub-title that will be displayed on the result screen
     - parameter icon: Icon that will be displayed on the result screen
     - parameter mainAction: Action for the main action button that will be displayed on the result screen
     - parameter secondaryAction: Action for the secondary action button that will be displayed on the result screen
     - parameter helpMessage: Help message that will be displayed on the result screen
     - parameter showPaymentMethod: True if you want to show the cell of payment method in the result screen
     - parameter statementDescription: Statement description that will be displayed on the result screen
     - parameter imageUrl: Image url for the icon that will be displayed on the result screen
     - parameter topCustomView: Custom view that will be displayed on the result screen on top
     - parameter bottomCustomView: Custom view that will be displayed on the result screen on bottom
     - parameter paymentStatus: Payment status of the payment result
     - parameter paymentStatusDetail: Payment status detail of the payment result
     */
    @available(*, deprecated: 4.7.0, message: "Use init with payment method id")
    public init(receiptId: String? = nil, status: PXBusinessResultStatus, title: String, subtitle: String? = nil, icon: UIImage? = nil, mainAction: PXAction? = nil, secondaryAction: PXAction?, helpMessage: String? = nil, showPaymentMethod: Bool = false, statementDescription: String? = nil, imageUrl: String? = nil, topCustomView: UIView? = nil, bottomCustomView: UIView? = nil, paymentStatus: String, paymentStatusDetail: String) {
        self.receiptId = receiptId
        self.status = status
        self.title = title
        self.subtitle = subtitle
        self.icon = icon
        self.mainAction = mainAction
        self.secondaryAction = secondaryAction
        self.helpMessage = helpMessage
        self.showPaymentMethod = showPaymentMethod
        self.statementDescription = statementDescription
        self.imageUrl = imageUrl
        self.topCustomView = topCustomView
        self.bottomCustomView = bottomCustomView
        self.paymentStatus = paymentStatus
        self.paymentStatusDetail = paymentStatusDetail
        self.paymentMethodId = nil
        self.paymentTypeId = nil
        super.init()
    }

    // MARK: Initialization
    /**
     Creates a `PXBusinessResult` which represents Business Payment Result.
     - parameter receiptId: Reference id for payment receipt.
     - parameter status: Business Status Result
     - parameter title: Title that will be displayed on the result screen
     - parameter subtitle: Sub-title that will be displayed on the result screen
     - parameter icon: Icon that will be displayed on the result screen
     - parameter mainAction: Action for the main action button that will be displayed on the result screen
     - parameter secondaryAction: Action for the secondary action button that will be displayed on the result screen
     - parameter helpMessage: Help message that will be displayed on the result screen
     - parameter showPaymentMethod: True if you want to show the cell of payment method in the result screen
     - parameter statementDescription: Statement description that will be displayed on the result screen
     - parameter imageUrl: Image url for the icon that will be displayed on the result screen
     - parameter topCustomView: Custom view that will be displayed on the result screen at top of Payment Method
     - parameter bottomCustomView: Custom view that will be displayed on the result screen at bottom of Payment Method
     - parameter paymentStatus: Payment status of the payment result
     - parameter paymentStatusDetail: Payment status detail of the payment result
     - parameter paymentMethodId: Payment method id
     - parameter paymentTypeId: Payment type id
      - parameter importantView: Custom view that will be displayed above crossSeling backend drive box. (Below congrats header)
     */
    public init(receiptId: String? = nil, status: PXBusinessResultStatus, title: String, subtitle: String? = nil, icon: UIImage? = nil, mainAction: PXAction? = nil, secondaryAction: PXAction?, helpMessage: String? = nil, showPaymentMethod: Bool = false, statementDescription: String? = nil, imageUrl: String? = nil, topCustomView: UIView? = nil, bottomCustomView: UIView? = nil, paymentStatus: String, paymentStatusDetail: String, paymentMethodId: String, paymentTypeId: String, importantView: UIView? = nil) {
        self.receiptId = receiptId
        self.status = status
        self.title = title
        self.subtitle = subtitle
        self.icon = icon
        self.mainAction = mainAction
        self.secondaryAction = secondaryAction
        self.helpMessage = helpMessage
        self.showPaymentMethod = showPaymentMethod
        self.statementDescription = statementDescription
        self.imageUrl = imageUrl
        self.topCustomView = topCustomView
        self.bottomCustomView = bottomCustomView
        self.paymentStatus = paymentStatus
        self.paymentStatusDetail = paymentStatusDetail
        self.paymentMethodId = paymentMethodId
        self.paymentTypeId = paymentTypeId
        self.importantView = importantView
        super.init()
    }
}

// MARK: Optional Setters
extension PXBusinessResult {
    // Set the receipt list (payment ids) for split payments.
    @discardableResult
    @objc public func setReceiptIdList(_ receiptList: [String]) -> PXBusinessResult {
        self.receiptIdList = receiptList
        return self
    }

    // TRUE to show receipt in Congrats screen.
    @discardableResult
    @objc public func shouldShowReceipt(_ shouldShow: Bool) -> PXBusinessResult {
        self.shouldShowReceipt = shouldShow
        return self
    }
}

// MARK: Getters
internal extension PXBusinessResult {

    func getBusinessStatus() -> PXBusinessResultStatus {
        return self.status
    }
    func getTitle() -> String {
        return self.title
    }
    func getStatementDescription() -> String? {
        return self.statementDescription
    }
    func getTopCustomView() -> UIView? {
        return self.topCustomView
    }
    func getBottomCustomView() -> UIView? {
        return self.bottomCustomView
    }
    func getImportantCustomView() -> UIView? {
        return self.importantView
    }
    func getImageUrl() -> String? {
        return self.imageUrl
    }
    func getReceiptId() -> String? {
        if let list = self.receiptIdList {
            return list.first
        }
        return self.receiptId
    }
    func getReceiptIdList() -> [String]? {
        return self.receiptIdList
    }
    func getSubTitle() -> String? {
        return self.subtitle
    }
    func getHelpMessage() -> String? {
        return self.helpMessage
    }
    func getIcon() -> UIImage? {
        return self.icon
    }
    func getMainAction() -> PXAction? {
        return self.mainAction
    }
    func getSecondaryAction() -> PXAction? {
        return self.secondaryAction
    }
    func mustShowPaymentMethod() -> Bool {
        return self.showPaymentMethod
    }
    func isApproved() -> Bool {
        return self.paymentStatus == PXPaymentStatus.APPROVED.rawValue
    }
    func mustShowReceipt() -> Bool {
        return self.shouldShowReceipt
    }
}

extension PXBusinessResult {
    internal func isAccepted() -> Bool {
        return self.status == .APPROVED
    }

    internal func isWarning() -> Bool {
        return self.status == .PENDING || self.status == .IN_PROGRESS
    }

    internal func isError() -> Bool {
        return self.status == .REJECTED
    }
}

// MARK: PXBaseResult implementation
extension PXBusinessResult {
    public func getPaymentMethodId() -> String? {
        return paymentMethodId
    }

    public func getPaymentMethodTypeId() -> String? {
        return  paymentTypeId
    }

    public func getPaymentId() -> String? {
        return receiptId
    }
    public func getStatus() -> String {
        return paymentStatus 
    }

    public func getStatusDetail() -> String {
        return paymentStatusDetail 
    }
}
