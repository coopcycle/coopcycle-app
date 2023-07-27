//
//  PXPaymentResultConfiguration.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 6/8/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 This object declares custom preferences (customizations) for "Congrats" screen.
 */
@objcMembers open class PXPaymentResultConfiguration: NSObject {
    // V4 final.
    private var topCustomView: UIView?
    private var bottomCustomView: UIView?

    /// :nodoc:
    override init() {}

    // MARK: Init.
    /**
     Define your custom UIViews. `topView` and `bottomView` of the screen.
     - parameter topView: Optional custom top view.
     - parameter bottomView: Optional custom bottom view.
     */
    public init(topView: UIView?  = nil, bottomView: UIView? = nil) {
        self.topCustomView = topView
        self.bottomCustomView = bottomView
    }

    // To deprecate post v4. SP integration.
    @available(*, deprecated)
    /// :nodoc:
    public enum ApprovedBadge {
        case pending
        case check
    }

    // To deprecate post v4. SP integration.
    private static let PENDING_CONTENT_TITLE = "¿Qué puedo hacer?"
    private static let REJECTED_CONTENT_TITLE = "¿Qué puedo hacer?"

    // MARK: FOOTER
    // To deprecate post v4. SP integration.
    internal var approvedSecondaryExitButtonText = ""
    internal var approvedSecondaryExitButtonCallback: ((PaymentResult) -> Void)?
    internal var hidePendingSecondaryButton = false
    internal var pendingSecondaryExitButtonText: String?
    internal var pendingSecondaryExitButtonCallback: ((PaymentResult) -> Void)?
    internal var hideRejectedSecondaryButton = false
    internal var rejectedSecondaryExitButtonText: String?
    internal var rejectedSecondaryExitButtonCallback: ((PaymentResult) -> Void)?
    internal var exitButtonTitle: String?

    // MARK: Approved
    // To deprecate post v4. SP integration.
    /// :nodoc:
    @available(*, deprecated)
    open var approvedBadge: ApprovedBadge? = ApprovedBadge.check
    private var _approvedLabelText = ""
    private var _disableApprovedLabelText = true
    internal lazy var approvedTitle = PXHeaderResutlConstants.APPROVED_HEADER_TITLE.localized
    internal var approvedSubtitle = ""
    internal var approvedURLImage: String?
    internal var approvedIconName = "default_item_icon"
    internal var approvedIconBundle = ResourceManager.shared.getBundle()!

    // MARK: Pending
    // To deprecate post v4. SP integration.
    private var _pendingLabelText = ""
    private var _disablePendingLabelText = true
    internal lazy var pendingTitle = PXHeaderResutlConstants.PENDING_HEADER_TITLE.localized
    internal var pendingSubtitle = ""
    internal lazy var pendingContentTitle = PXPaymentResultConfiguration.PENDING_CONTENT_TITLE.localized
    internal var pendingContentText = ""
    internal var pendingIconName = "default_item_icon"
    internal var pendingIconBundle = ResourceManager.shared.getBundle()!
    internal var pendingURLImage: String?
    internal var hidePendingContentText = false
    internal var hidePendingContentTitle = false

    // MARK: Rejected
    // To deprecate post v4. SP integration.
    private var disableRejectedLabelText = false
    internal lazy var rejectedTitle = PXHeaderResutlConstants.REJECTED_HEADER_TITLE.localized
    internal var rejectedSubtitle = ""
    internal var rejectedTitleSetted = false
    internal lazy var rejectedIconSubtext = PXHeaderResutlConstants.REJECTED_ICON_SUBTEXT.localized
    internal var rejectedBolbradescoIconName = "MPSDK_payment_result_bolbradesco_error"
    internal var rejectedPaymentMethodPluginIconName = "MPSDK_payment_result_plugin_error"
    internal var rejectedIconBundle = ResourceManager.shared.getBundle()!
    internal var rejectedDefaultIconName: String?
    internal var rejectedURLImage: String?
    internal var rejectedIconName: String?
    internal lazy var rejectedContentTitle = PXPaymentResultConfiguration.REJECTED_CONTENT_TITLE.localized
    internal var rejectedContentText = ""
    internal var hideRejectedContentText = false
    internal var hideRejectedContentTitle = false

    // MARK: Commons
    // To deprecate post v4. SP integration.
    internal var showBadgeImage = true
    internal var showLabelText = true
    internal var pmDefaultIconName = "card_icon"
    internal var pmBolbradescoIconName = "boleto_icon"
    internal var pmIconBundle = ResourceManager.shared.getBundle()!
    internal var statusBackgroundColor: UIColor?
    internal var hideApprovedPaymentBodyCell = false
    internal var hideContentCell = false
    internal var hideAmount = false
    internal var hidePaymentId = false
    internal var hidePaymentMethod = false
}

// MARK: - Internal Getters.
extension PXPaymentResultConfiguration {
    internal func getTopCustomView() -> UIView? {
        return topCustomView
    }

    internal func getBottomCustomView() -> UIView? {
        return bottomCustomView
    }
}

// MARK: To deprecate post v4. SP integration.
/** :nodoc: */
extension PXPaymentResultConfiguration {
    @available(*, deprecated)
    open func shouldShowBadgeImage() {
        self.showBadgeImage = true
    }

    @available(*, deprecated)
    open func hideBadgeImage() {
        self.showBadgeImage = false
    }

    @available(*, deprecated)
    open func shouldShowLabelText() {
        self.showLabelText = true
    }

    @available(*, deprecated)
    open func hideLabelText() {
        self.showLabelText = false
    }

    @available(*, deprecated)
    open func getApprovedBadgeImage() -> UIImage? {
        guard let badge = approvedBadge else {
            return nil
        }
        if badge == ApprovedBadge.check {
            return ResourceManager.shared.getImage("ok_badge")
        } else if badge == ApprovedBadge.pending {
            return ResourceManager.shared.getImage("pending_badge")
        }
        return nil
    }

    @available(*, deprecated)
    open func disableApprovedLabelText() {
        self._disableApprovedLabelText = true
    }

    @available(*, deprecated)
    open func setApproved(labelText: String) {
        self._disableApprovedLabelText = false
        self._approvedLabelText = labelText
    }

    @available(*, deprecated)
    open func getApprovedLabelText() -> String? {
        if self._disableApprovedLabelText {
            return nil
        } else {
            return self._approvedLabelText
        }
    }

    @available(*, deprecated)
    open func setBadgeApproved(badge: ApprovedBadge) {
        self.approvedBadge = badge
    }

    @available(*, deprecated)
    open func setApproved(title: String) {
        self.approvedTitle = title
    }

    @available(*, deprecated)
    open func setApprovedSubtitle(subtitle: String) {
        self.approvedSubtitle = subtitle
    }

    @available(*, deprecated)
    open func setApprovedHeaderIcon(name: String, bundle: Bundle) {
        self.approvedIconName = name
        self.approvedIconBundle = bundle
    }

    @available(*, deprecated)
    open func setApprovedHeaderIcon(stringURL: String) {
        self.approvedURLImage = stringURL
    }

    @available(*, deprecated)
    open func disablePendingLabelText() {
        self._disablePendingLabelText = true
    }

    @available(*, deprecated)
    open func setPending(labelText: String) {
        self._disablePendingLabelText = false
        self._pendingLabelText = labelText
    }

    @available(*, deprecated)
    open func getPendingLabelText() -> String? {
        if self._disablePendingLabelText {
            return nil
        } else {
            return self._pendingLabelText
        }
    }

    @available(*, deprecated)
    open func setPending(title: String) {
        self.pendingTitle = title
    }

    @available(*, deprecated)
    open func setPendingSubtitle(subtitle: String) {
        self.pendingSubtitle = subtitle
    }

    @available(*, deprecated)
    open func setPendingHeaderIcon(name: String, bundle: Bundle) {
        self.pendingIconName = name
        self.pendingIconBundle = bundle
    }

    @available(*, deprecated)
    open func setPendingHeaderIcon(stringURL: String) {
        self.pendingURLImage = stringURL
    }

    @available(*, deprecated)
    open func setPendingContentText(text: String) {
        self.pendingContentText = text
    }

    @available(*, deprecated)
    open func setPendingContentTitle(title: String) {
        self.pendingContentTitle = title
    }

    @available(*, deprecated)
    open func disablePendingSecondaryExitButton() {
        self.hidePendingSecondaryButton = true
    }

    @available(*, deprecated)
    open func disablePendingContentText() {
        self.hidePendingContentText = true
    }

    @available(*, deprecated)
    open func disablePendingContentTitle() {
        self.hidePendingContentTitle = true
    }

    @available(*, deprecated)
    open func setRejected(title: String) {
        self.rejectedTitle = title
        self.rejectedTitleSetted = true
    }

    @available(*, deprecated)
    open func setRejectedSubtitle(subtitle: String) {
        self.rejectedSubtitle = subtitle
    }

    @available(*, deprecated)
    open func setRejectedHeaderIcon(name: String, bundle: Bundle) {
        self.rejectedIconName = name
        self.rejectedIconBundle = bundle
    }

    @available(*, deprecated)
    open func setRejectedHeaderIcon(stringURL: String) {
        self.rejectedURLImage = stringURL
    }

    @available(*, deprecated)
    open func setRejectedContentText(text: String) {
        self.rejectedContentText = text
    }

    @available(*, deprecated)
    open func setRejectedContentTitle(title: String) {
        self.rejectedContentTitle = title
    }

    @available(*, deprecated)
    open func disableRejectedLabel() {
        self.disableRejectedLabelText = true
    }

    @available(*, deprecated)
    open func setRejectedIconSubtext(text: String) {
        self.rejectedIconSubtext = text
        if text.count == 0 {
            self.disableRejectedLabelText = true
        }
    }

    @available(*, deprecated)
    open func disableRejectdSecondaryExitButton() {
        self.hideRejectedSecondaryButton = true
    }

    @available(*, deprecated)
    open func disableRejectedContentText() {
        self.hideRejectedContentText = true
    }

    @available(*, deprecated)
    open func disableRejectedContentTitle() {
        self.hideRejectedContentTitle = true
    }

    @available(*, deprecated)
    open func setExitButtonTitle(title: String) {
        self.exitButtonTitle = title
    }

    @available(*, deprecated)
    open func setStatusBackgroundColor(color: UIColor) {
        self.statusBackgroundColor = color
    }

    @available(*, deprecated)
    open func getStatusBackgroundColor() -> UIColor? {
        return statusBackgroundColor
    }

    @available(*, deprecated)
    open func disableContentCell() {
        self.hideContentCell = true
    }

    @available(*, deprecated)
    open func disableApprovedBodyCell() {
        self.hideApprovedPaymentBodyCell = true
    }

    @available(*, deprecated)
    open func disableApprovedAmount() {
        self.hideAmount = true
    }

    @available(*, deprecated)
    open func disableApprovedReceipt() {
        self.hidePaymentId = true
    }

    @available(*, deprecated)
    open func disableApprovedPaymentMethodInfo() {
        self.hidePaymentMethod = true
    }

    @available(*, deprecated)
    open func enableAmount() {
        self.hideAmount = false
    }

    @available(*, deprecated)
    open func enableApprovedReceipt() {
        self.hidePaymentId = true
    }

    @available(*, deprecated)
    open func enableContnentCell() {
        self.hideContentCell = false
    }

    @available(*, deprecated)
    open func enableApprovedPaymentBodyCell() {
        self.hideApprovedPaymentBodyCell = false
    }

    @available(*, deprecated)
    open func enablePaymentContentText() {
        self.hidePendingContentText = false
    }

    @available(*, deprecated)
    open func enablePaymentContentTitle() {
        self.hidePendingContentTitle = false
    }

    @available(*, deprecated)
    open func enableApprovedPaymentMethodInfo() {
        self.hidePaymentMethod = false
    }

    @available(*, deprecated)
    open func getApprovedTitle() -> String {
        return approvedTitle
    }

    @available(*, deprecated)
    open func getApprovedSubtitle() -> String {
        return approvedSubtitle
    }

    @available(*, deprecated)
    open func getApprovedSecondaryButtonText() -> String {
        return approvedSecondaryExitButtonText
    }

    @available(*, deprecated)
    open func getHeaderApprovedIcon() -> UIImage? {
        if let urlImage = approvedURLImage {
            if let image = ViewUtils.loadImageFromUrl(urlImage) {
                return image
            }
        }
        return ResourceManager.shared.getImage(approvedIconName)
    }

    @available(*, deprecated)
    open func getPendingTitle() -> String {
        return pendingTitle
    }

    @available(*, deprecated)
    open func getPendingSubtitle() -> String {
        return pendingSubtitle
    }

    @available(*, deprecated)
    open func getHeaderPendingIcon() -> UIImage? {
        if let urlImage = self.pendingURLImage {
            if let image = ViewUtils.loadImageFromUrl(urlImage) {
                return image
            }
        }
        return ResourceManager.shared.getImage(pendingIconName)
    }

    @available(*, deprecated)
    open func getPendingContetTitle() -> String {
        return pendingContentTitle
    }

    @available(*, deprecated)
    open func getPendingContentText() -> String {
        return pendingContentText
    }

    @available(*, deprecated)
    open func getPendingSecondaryButtonText() -> String? {
        return pendingSecondaryExitButtonText
    }

    @available(*, deprecated)
    open func isPendingSecondaryExitButtonDisable() -> Bool {
        return hidePendingSecondaryButton
    }

    @available(*, deprecated)
    open func isPendingContentTextDisable() -> Bool {
        return hidePendingContentText
    }

    @available(*, deprecated)
    open func isPendingContentTitleDisable() -> Bool {
        return hidePendingContentTitle
    }

    @available(*, deprecated)
    open func getRejectedTitle() -> String {
        return rejectedTitle
    }

    @available(*, deprecated)
    open func getRejectedSubtitle() -> String {
        return rejectedSubtitle
    }

    @available(*, deprecated)
    open func setHeaderRejectedIcon(name: String, bundle: Bundle) {
        self.rejectedDefaultIconName = name
        self.approvedIconBundle = bundle
    }

    @available(*, deprecated)
    open func getHeaderRejectedIcon(_ paymentMethod: PXPaymentMethod?) -> UIImage? {
        if let urlImage = self.rejectedURLImage {
            if let image = ViewUtils.loadImageFromUrl(urlImage) {
                return image
            }
        }
        if rejectedIconName != nil {
            return ResourceManager.shared.getImage(rejectedIconName)
        }
        return getHeaderImageFor(paymentMethod)
    }

    @available(*, deprecated)
    open func getHeaderImageFor(_ paymentMethod: PXPaymentMethod?) -> UIImage? {
        guard let paymentMethod = paymentMethod else {
            return ResourceManager.shared.getImage(pmDefaultIconName)
        }

        if paymentMethod.isBolbradesco {
            return ResourceManager.shared.getImage(pmBolbradescoIconName)
        }

        if paymentMethod.paymentTypeId == PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue {
            return ResourceManager.shared.getImage(rejectedPaymentMethodPluginIconName)
        }
        return ResourceManager.shared.getImage(pmDefaultIconName)
    }

    @available(*, deprecated)
    open func getRejectedContetTitle() -> String {
        return rejectedContentTitle
    }

    @available(*, deprecated)
    open func getRejectedContentText() -> String {
        return rejectedContentText
    }

    @available(*, deprecated)
    open func getRejectedIconSubtext() -> String {
        return rejectedIconSubtext
    }

    @available(*, deprecated)
    open func getRejectedSecondaryButtonText() -> String? {
        return rejectedSecondaryExitButtonText
    }

    @available(*, deprecated)
    open func isRejectedSecondaryExitButtonDisable() -> Bool {
        return hideRejectedSecondaryButton
    }

    @available(*, deprecated)
    open func isRejectedContentTextDisable() -> Bool {
        return hideRejectedContentText
    }

    @available(*, deprecated)
    open func isRejectedContentTitleDisable() -> Bool {
        return hideRejectedContentTitle
    }

    @available(*, deprecated)
    open func getExitButtonTitle() -> String? {
        if let title = exitButtonTitle {
            return title.localized
        }
        return nil
    }

    @available(*, deprecated)
    open func isContentCellDisable() -> Bool {
        return hideContentCell
    }

    @available(*, deprecated)
    open func isApprovedPaymentBodyDisableCell() -> Bool {
        return hideApprovedPaymentBodyCell
    }

    @available(*, deprecated)
    open func isPaymentMethodDisable() -> Bool {
        return hidePaymentMethod
    }

    @available(*, deprecated)
    open func isAmountDisable() -> Bool {
        return hideAmount
    }

    @available(*, deprecated)
    open func isPaymentIdDisable() -> Bool {
        return hidePaymentId
    }
}
