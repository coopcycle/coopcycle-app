//
//  PXReviewViewController.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 27/2/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXReviewViewController: PXComponentContainerViewController {

    var footerView: UIView!
    var floatingButtonView: UIView!

    // MARK: Definitions
    var termsConditionView: PXTermsAndConditionView!
    var discountTermsConditionView: PXTermsAndConditionView?
    lazy var itemViews = [UIView]()
    private var viewModel: PXReviewViewModel!

    var callbackPaymentData: ((PXPaymentData) -> Void)
    var callbackConfirm: ((PXPaymentData) -> Void)
    var finishButtonAnimation: (() -> Void)
    var changePayerInformation: ((PXPaymentData) -> Void)

    weak var loadingButtonComponent: PXAnimatedButton?
    weak var loadingFloatingButtonComponent: PXAnimatedButton?
    let timeOutPayButton: TimeInterval
    let shouldAnimatePayButton: Bool
    private let SHADOW_DELTA: CGFloat = 1
    private var DID_ENTER_DYNAMIC_VIEW_CONTROLLER_SHOWED: Bool = false

    internal var changePaymentMethodCallback: (() -> Void)?

    // MARK: Lifecycle - Publics
    init(viewModel: PXReviewViewModel, timeOutPayButton: TimeInterval = 15, shouldAnimatePayButton: Bool, callbackPaymentData : @escaping ((PXPaymentData) -> Void), callbackConfirm: @escaping ((PXPaymentData) -> Void), finishButtonAnimation: @escaping (() -> Void), changePayerInformation: @escaping ((PXPaymentData) -> Void)) {
        self.viewModel = viewModel
        self.callbackPaymentData = callbackPaymentData
        self.callbackConfirm = callbackConfirm
        self.finishButtonAnimation = finishButtonAnimation
        self.changePayerInformation = changePayerInformation
        self.timeOutPayButton = timeOutPayButton
        self.shouldAnimatePayButton = shouldAnimatePayButton
        super.init()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if !DID_ENTER_DYNAMIC_VIEW_CONTROLLER_SHOWED {

            trackScreen(path: TrackingPaths.Screens.getReviewAndConfirmPath(), properties: viewModel.getScreenProperties())

            if let dynamicViewController = self.viewModel.getDynamicViewController() {
                self.present(dynamicViewController, animated: true) { [weak self] in
                    self?.DID_ENTER_DYNAMIC_VIEW_CONTROLLER_SHOWED = true
                }
            }
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setupUI()
        self.scrollView.showsVerticalScrollIndicator = false
        self.scrollView.showsHorizontalScrollIndicator = false
        self.view.layoutIfNeeded()
        self.checkFloatingButtonVisibility()
        scrollView.isScrollEnabled = true
        view.isUserInteractionEnabled = true
        // Temporary fix for MP/Meli UX incompatibility
        UIApplication.shared.statusBarStyle = .default
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if shouldAnimatePayButton {
            unsubscribeFromNotifications()
            showNavBarForAnimation()
        }
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        loadingButtonComponent?.resetButton()
        loadingFloatingButtonComponent?.resetButton()
    }

    func update(viewModel: PXReviewViewModel) {
        self.viewModel = viewModel
    }
}

// MARK: UI Methods
extension PXReviewViewController {

    private func setupUI() {
        navBarTextColor = ThemeManager.shared.getTitleColorForReviewConfirmNavigation()
        loadMPStyles()
        navigationController?.navigationBar.barTintColor = ThemeManager.shared.highlightBackgroundColor()
        navigationItem.leftBarButtonItem?.tintColor = ThemeManager.shared.getTitleColorForReviewConfirmNavigation()
        if contentView.getSubviews().isEmpty {
            HtmlStorage.shared.clean()
            renderViews()
        }
    }

    private func renderViews() {
        unsubscribeFromNotifications()
        self.contentView.prepareForRender()

        // Add title view.
        let titleView = getTitleComponentView()
        contentView.addSubview(titleView)
        PXLayout.pinTop(view: titleView).isActive = true
        PXLayout.centerHorizontally(view: titleView).isActive = true
        PXLayout.matchWidth(ofView: titleView).isActive = true

        // Add summary view.
        let summaryView = getSummaryComponentView()
        contentView.addSubviewToBottom(summaryView)
        PXLayout.centerHorizontally(view: summaryView).isActive = true
        PXLayout.matchWidth(ofView: summaryView).isActive = true

        // Payer info
        if self.viewModel.shouldShowPayer() {
            if let payerView = getPayerComponentView() {
                contentView.addSubviewToBottom(payerView)
                PXLayout.centerHorizontally(view: payerView).isActive = true
                PXLayout.matchWidth(ofView: payerView).isActive = true
            }
        }

        // Add CFT view.
        if let cftView = getCFTComponentView() {
            contentView.addSubviewToBottom(cftView)
            PXLayout.centerHorizontally(view: cftView).isActive = true
            PXLayout.matchWidth(ofView: cftView).isActive = true
        }

        // Add discount terms and conditions.
        if self.viewModel.shouldShowDiscountTermsAndCondition() {
            let discountTCView = viewModel.getDiscountTermsAndConditionView()
            discountTermsConditionView = discountTCView
            discountTCView.addSeparatorLineToBottom(height: 1, horizontalMarginPercentage: 100)
            contentView.addSubviewToBottom(discountTCView)
            PXLayout.matchWidth(ofView: discountTCView).isActive = true
            PXLayout.centerHorizontally(view: discountTCView).isActive = true
            discountTCView.delegate = self
        }

        // Add item views
        itemViews = buildItemComponentsViews()
        for itemView in itemViews {
            contentView.addSubviewToBottom(itemView)
            PXLayout.centerHorizontally(view: itemView).isActive = true
            PXLayout.matchWidth(ofView: itemView).isActive = true
            itemView.addSeparatorLineToBottom(height: 1)
        }

        // Top Dynamic Custom Views
        if let topDynamicCustomViews = getTopDynamicCustomViews() {
            for customView in topDynamicCustomViews {
                customView.addSeparatorLineToBottom(height: 1)
                customView.clipsToBounds = true
                contentView.addSubviewToBottom(customView)
                PXLayout.matchWidth(ofView: customView).isActive = true
                PXLayout.centerHorizontally(view: customView).isActive = true
            }
        }

        // Top Custom View
        if let topCustomView = getTopCustomView() {
            topCustomView.addSeparatorLineToBottom(height: 1)
            topCustomView.clipsToBounds = true
            contentView.addSubviewToBottom(topCustomView)
            PXLayout.matchWidth(ofView: topCustomView).isActive = true
            PXLayout.centerHorizontally(view: topCustomView).isActive = true
        }

        // Add payment method view.
        if let paymentMethodView = getPaymentMethodComponentView() {
            paymentMethodView.addSeparatorLineToBottom(height: 1)
            contentView.addSubviewToBottom(paymentMethodView)
            PXLayout.matchWidth(ofView: paymentMethodView).isActive = true
            PXLayout.centerHorizontally(view: paymentMethodView).isActive = true
        }

        // Bottom Dynamic Custom Views
        if let bottomDynamicCustomViews = getBottomDynamicCustomViews() {
            for customView in bottomDynamicCustomViews {
                customView.addSeparatorLineToBottom(height: 1)
                customView.clipsToBounds = true
                contentView.addSubviewToBottom(customView)
                PXLayout.matchWidth(ofView: customView).isActive = true
                PXLayout.centerHorizontally(view: customView).isActive = true
            }
        }

        // Bottom Custom View
        if let bottomCustomView = getBottomCustomView() {
            bottomCustomView.addSeparatorLineToBottom(height: 1)
            bottomCustomView.clipsToBounds = true
            contentView.addSubviewToBottom(bottomCustomView)
            PXLayout.matchWidth(ofView: bottomCustomView).isActive = true
            PXLayout.centerHorizontally(view: bottomCustomView).isActive = true
        }

        // Add terms and conditions.
        if viewModel.shouldShowTermsAndCondition() {
            termsConditionView = getTermsAndConditionView()
            contentView.addSubview(termsConditionView)
            PXLayout.matchWidth(ofView: termsConditionView).isActive = true
            PXLayout.centerHorizontally(view: termsConditionView).isActive = true
            contentView.addSubviewToBottom(termsConditionView)
            termsConditionView.delegate = self
        }

        //Add Footer
        footerView = getFooterView()
        footerView.backgroundColor = .clear
        contentView.addSubviewToBottom(footerView)
        PXLayout.matchWidth(ofView: footerView).isActive = true
        PXLayout.centerHorizontally(view: footerView, to: contentView).isActive = true
        self.view.layoutIfNeeded()
        PXLayout.setHeight(owner: footerView, height: viewModel.getFloatingConfirmViewHeight() + SHADOW_DELTA).isActive = true
        footerView.layoutIfNeeded()

        // Add floating button
        floatingButtonView = getFloatingButtonView()
        view.addSubview(floatingButtonView)
        PXLayout.setHeight(owner: floatingButtonView, height: viewModel.getFloatingConfirmViewHeight()).isActive = true
        PXLayout.matchWidth(ofView: floatingButtonView).isActive = true
        PXLayout.centerHorizontally(view: floatingButtonView).isActive = true
        PXLayout.pinBottom(view: floatingButtonView, to: view, withMargin: 0).isActive = true
        floatingButtonView.layoutIfNeeded()

        contentView.backgroundColor = ThemeManager.shared.detailedBackgroundColor()
        scrollView.backgroundColor = ThemeManager.shared.detailedBackgroundColor()

        // Add elastic header.
        addElasticHeader(headerBackgroundColor: summaryView.backgroundColor, navigationCustomTitle: PXReviewTitleComponentProps.DEFAULT_TITLE.localized, textColor: ThemeManager.shared.getTitleColorForReviewConfirmNavigation())

        self.view.layoutIfNeeded()
        PXLayout.pinFirstSubviewToTop(view: self.contentView)?.isActive = true
        PXLayout.pinLastSubviewToBottom(view: self.contentView)?.isActive = true
        self.scrollViewPinBottomConstraint.constant = 0

        super.refreshContentViewSize()
        self.checkFloatingButtonVisibility()
    }
}

// MARK: Component Builders
extension PXReviewViewController {

    private func buildItemComponentsViews() -> [UIView] {
        var itemViews = [UIView]()
        let itemComponents = viewModel.buildItemComponents()
        for items in itemComponents {
            itemViews.append(items.render())
        }
        return itemViews
    }

    private func isConfirmButtonVisible() -> Bool {
        guard let floatingButton = self.floatingButtonView, let fixedButton = self.footerView else {
            return false
        }
        let floatingButtonCoordinates = floatingButton.convert(CGPoint.zero, from: self.view.window)
        let fixedButtonCoordinates = fixedButton.convert(CGPoint.zero, from: self.view.window)
        return fixedButtonCoordinates.y > floatingButtonCoordinates.y
    }

    private func getPaymentMethodComponentView() -> UIView? {
        let action = PXAction(label: "review_change_payment_method_action".localized, action: { [weak self] in
            if let reviewViewModel = self?.viewModel {
                self?.trackEvent(path: TrackingPaths.Events.ReviewConfirm.getChangePaymentMethodPath())
                if let callBackAction = self?.changePaymentMethodCallback {
                    PXNotificationManager.UnsuscribeTo.attemptToClose(MercadoPagoCheckout.currentCheckout as Any)
                    callBackAction()
                } else {
                    self?.callbackPaymentData(reviewViewModel.getClearPaymentData())
                }
            }
        })
        if let paymentMethodComponent = viewModel.buildPaymentMethodComponent(withAction: action) {
            return paymentMethodComponent.render()
        }
        return nil
    }

    private func getSummaryComponentView() -> UIView {
        let summaryComponent = viewModel.buildSummaryComponent(width: PXLayout.getScreenWidth())
        let summaryView = summaryComponent.render()
        return summaryView
    }

    fileprivate func getPayerComponentView() -> UIView? {
        if let payerComponent = viewModel.buildPayerComponent() {
            let payerView = payerComponent.render()
            return payerView
        }

        return nil
    }

    private func getTitleComponentView() -> UIView {
        let titleComponent = viewModel.buildTitleComponent()
        return titleComponent.render()
    }

    private func getCFTComponentView() -> UIView? {
        if viewModel.hasPayerCostAddionalInfo() {
            let cftView = PXCFTComponentView(withCFTValue: self.viewModel.amountHelper.getPaymentData().payerCost?.getCFTValue(), titleColor: ThemeManager.shared.labelTintColor(), backgroundColor: ThemeManager.shared.highlightBackgroundColor())
            return cftView
        }
        return nil
    }

    private func getFloatingButtonView() -> PXContainedActionButtonView {
        let component = PXContainedActionButtonComponent(props: PXContainedActionButtonProps(title: "Pagar".localized, action: {
            guard let targetButton = self.loadingFloatingButtonComponent else { return }
            self.confirmPayment(targetButton)
        }, animationDelegate: self, termsInfo: self.viewModel.creditsTermsAndConditions()), termsDelegate: self)
        let containedButtonView = PXContainedActionButtonRenderer(termsDelegate: self).render(component)
        loadingFloatingButtonComponent = containedButtonView.button
        loadingFloatingButtonComponent?.layer.cornerRadius = 4
        containedButtonView.backgroundColor = ThemeManager.shared.detailedBackgroundColor()
        return containedButtonView
    }

    private func getFooterView() -> UIView {
        let payAction = PXAction(label: "Pagar".localized) {
            guard let targetButton = self.loadingButtonComponent else { return }
            self.confirmPayment(targetButton)
        }
        let footerProps = PXFooterProps(buttonAction: payAction, animationDelegate: self, pinLastSubviewToBottom: false, termsInfo: self.viewModel.creditsTermsAndConditions())
        let footerComponent = PXFooterComponent(props: footerProps)
        let footerView = PXFooterRenderer(termsDelegate: self).render(footerComponent)
        loadingButtonComponent = footerView.principalButton
        loadingButtonComponent?.layer.cornerRadius = 4
        footerView.backgroundColor = .clear
        return footerView
    }

    private func getTermsAndConditionView() -> PXTermsAndConditionView {
        let termsAndConditionView = PXTermsAndConditionView()
        return termsAndConditionView
    }

    private func getTopDynamicCustomViews() -> [UIView]? {
        return viewModel.buildTopDynamicCustomViews()
    }

    private func getBottomDynamicCustomViews() -> [UIView]? {
        return viewModel.buildBottomDynamicCustomViews()
    }

    private func getTopCustomView() -> UIView? {
        return viewModel.buildTopCustomView()
    }

    private func getBottomCustomView() -> UIView? {
        return viewModel.buildBottomCustomView()
    }

    override func scrollViewDidScroll(_ scrollView: UIScrollView) {
        super.scrollViewDidScroll(scrollView)
        let loadingButtonAnimated = loadingButtonComponent?.isAnimated() ?? false
        let loadingFloatingButtonAnimated = loadingFloatingButtonComponent?.isAnimated() ?? false
        if !loadingButtonAnimated && !loadingFloatingButtonAnimated {
            self.checkFloatingButtonVisibility()
        }
    }

    func checkFloatingButtonVisibility() {
        if !isConfirmButtonVisible() {
            self.floatingButtonView.alpha = 1
            self.footerView?.alpha = 0
        } else {
            self.floatingButtonView.alpha = 0
            self.footerView?.alpha = 1
        }
    }
}

// MARK: Actions.
extension PXReviewViewController: PXTermsAndConditionViewDelegate {
    private func confirmPayment(_ targetButton: PXAnimatedButton) {
        if viewModel.shouldValidateWithBiometric() {
            let biometricModule = PXConfiguratorManager.biometricProtocol
            biometricModule.validate(config: PXConfiguratorManager.biometricConfig, onSuccess: { [weak self] in
                DispatchQueue.main.async {
                    self?.doPayment(targetButton)
                }
            }) { [weak self] error in
                // User abort validation or validation fail.
                self?.trackEvent(path: TrackingPaths.Events.getErrorPath())
            }
        } else {
            self.doPayment(targetButton)
        }
    }

    private func doPayment(_ targetButton: PXAnimatedButton) {
        if shouldAnimatePayButton {
            subscribeLoadingButtonToNotifications(loadingButton: targetButton)
            targetButton.startLoading(timeOut: self.timeOutPayButton)
        }
        scrollView.isScrollEnabled = false
        view.isUserInteractionEnabled = false
        trackEvent(path: TrackingPaths.Events.ReviewConfirm.getConfirmPath(), properties: viewModel.getConfirmEventProperties())
        self.hideBackButton()
        self.callbackConfirm(self.viewModel.amountHelper.getPaymentData())
    }

    func resetButton() {
        loadingButtonComponent?.resetButton()
        loadingFloatingButtonComponent?.resetButton()
        if isConfirmButtonVisible() {
            loadingButtonComponent?.showErrorToast()
        } else {
            loadingFloatingButtonComponent?.showErrorToast()
        }
    }

    func shouldOpenTermsCondition(_ title: String, url: URL) {
        let webVC = WebViewController(url: url, navigationBarTitle: title)
        webVC.title = title
        self.navigationController?.pushViewController(webVC, animated: true)
    }
}

// MARK: Payment Button animation delegate
@available(iOS 9.0, *)
extension PXReviewViewController: PXAnimatedButtonDelegate {
    func shakeDidFinish() {
        showNavBarForAnimation()
        displayBackButton()
        scrollView.isScrollEnabled = true
        view.isUserInteractionEnabled = true
        unsubscribeFromNotifications()
        UIView.animate(withDuration: 0.3, animations: {
            self.loadingButtonComponent?.backgroundColor = ThemeManager.shared.getAccentColor()
            self.loadingFloatingButtonComponent?.backgroundColor = ThemeManager.shared.getAccentColor()
        })
    }

    func expandAnimationInProgress() {
        if isNavBarHidden() {
            UIView.animate(withDuration: 0.3, animations: {
                self.navigationController?.isNavigationBarHidden = true
            })
        } else {
            hideNavBarForAnimation()
        }
    }

    func didFinishAnimation() {
        self.finishButtonAnimation()
    }

    func progressButtonAnimationTimeOut() {
        loadingButtonComponent?.resetButton()
        loadingFloatingButtonComponent?.resetButton()
        if isConfirmButtonVisible() {
            loadingButtonComponent?.showErrorToast()
        } else {
            loadingFloatingButtonComponent?.showErrorToast()
        }
// MARK: Uncomment for Shake button
//        loadingFloatingButtonComponent?.shake()
//        loadingButtonComponent?.shake()
    }

    func hideNavBarForAnimation() {
        self.navigationController?.navigationBar.layer.zPosition = -1
    }

    func showNavBarForAnimation() {
        self.navigationController?.navigationBar.layer.zPosition = 0
    }
}

// MARK: Notifications
extension PXReviewViewController {
    func subscribeLoadingButtonToNotifications(loadingButton: PXAnimatedButton?) {
        guard let loadingButton = loadingButton else {
            return
        }
        PXNotificationManager.SuscribeTo.animateButton(loadingButton, selector: #selector(loadingButton.animateFinish))
    }

    func unsubscribeFromNotifications() {
        PXNotificationManager.UnsuscribeTo.animateButton(loadingButtonComponent)
        PXNotificationManager.UnsuscribeTo.animateButton(loadingFloatingButtonComponent)
    }
}
