//
//  PXOneTapViewController.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 15/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit
import MLCardForm

final class PXOneTapViewController: PXComponentContainerViewController {

    // MARK: Definitions
    lazy var itemViews = [UIView]()
    fileprivate var viewModel: PXOneTapViewModel
    private var discountTermsConditionView: PXTermsAndConditionView?

    let slider = PXCardSlider()

    // MARK: Callbacks
    var callbackPaymentData: ((PXPaymentData) -> Void)
    var callbackConfirm: ((PXPaymentData, Bool) -> Void)
    var callbackUpdatePaymentOption: ((PaymentMethodOption) -> Void)
    var callbackRefreshInit: ((String) -> Void)
    var callbackExit: (() -> Void)
    var finishButtonAnimation: (() -> Void)

    var loadingButtonComponent: PXAnimatedButton?
    var installmentInfoRow: PXOneTapInstallmentInfoView?
    var installmentsSelectorView: PXOneTapInstallmentsSelectorView?
    var headerView: PXOneTapHeaderView?
    var whiteView: UIView?
    var selectedCard: PXCardSliderViewModel?

    let timeOutPayButton: TimeInterval

    var cardSliderMarginConstraint: NSLayoutConstraint?
    private var navigationBarTapGesture: UITapGestureRecognizer?

    // MARK: Lifecycle/Publics
    init(viewModel: PXOneTapViewModel, timeOutPayButton: TimeInterval = 15, callbackPaymentData : @escaping ((PXPaymentData) -> Void), callbackConfirm: @escaping ((PXPaymentData, Bool) -> Void), callbackUpdatePaymentOption: @escaping ((PaymentMethodOption) -> Void), callbackRefreshInit: @escaping ((String) -> Void), callbackExit: @escaping (() -> Void), finishButtonAnimation: @escaping (() -> Void)) {
        self.viewModel = viewModel
        self.callbackPaymentData = callbackPaymentData
        self.callbackConfirm = callbackConfirm
        self.callbackRefreshInit = callbackRefreshInit
        self.callbackExit = callbackExit
        self.callbackUpdatePaymentOption = callbackUpdatePaymentOption
        self.finishButtonAnimation = finishButtonAnimation
        self.timeOutPayButton = timeOutPayButton
        super.init(adjustInsets: false)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setupNavigationBar()
        setupUI()
        scrollView.isScrollEnabled = true
        view.isUserInteractionEnabled = true
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        PXNotificationManager.UnsuscribeTo.animateButton(loadingButtonComponent)
        removeNavigationTapGesture()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        loadingButtonComponent?.resetButton()
    }

    override public func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        navigationController?.delegate = self
        slider.showBottomMessageIfNeeded(index: 0, targetIndex: 0)
        trackScreen(path: TrackingPaths.Screens.OneTap.getOneTapPath(), properties: viewModel.getOneTapScreenProperties())
    }

    func update(viewModel: PXOneTapViewModel, cardId: String) {
        self.viewModel = viewModel
        viewModel.createCardSliderViewModel()
        let cardSliderViewModel = viewModel.getCardSliderViewModel()
        slider.update(cardSliderViewModel)
        installmentInfoRow?.update(model: viewModel.getInstallmentInfoViewModel())

        if let index = cardSliderViewModel.firstIndex(where: { $0.cardId == cardId }) {
            selectCardInSliderAtIndex(index)
        } else {
            //Select first item
            selectFirstCardInSlider()
        }
        if let navigationController = navigationController,
            let cardFormViewController = navigationController.viewControllers.first(where: { $0 is MLCardFormViewController }) as? MLCardFormViewController {
            cardFormViewController.dismissLoadingAndPop()
        }
    }
}

// MARK: UI Methods.
extension PXOneTapViewController {
    private func setupNavigationBar() {
        setBackground(color: ThemeManager.shared.navigationBar().backgroundColor)
        navBarTextColor = ThemeManager.shared.labelTintColor()
        loadMPStyles()
        navigationController?.navigationBar.isTranslucent = true
        navigationController?.navigationBar.barTintColor = ThemeManager.shared.whiteColor()
        navigationItem.leftBarButtonItem?.tintColor = ThemeManager.shared.navigationBar().getTintColor()
        navigationController?.navigationBar.backgroundColor = ThemeManager.shared.highlightBackgroundColor()
        navigationController?.navigationBar.setBackgroundImage(UIImage(), for: UIBarMetrics.default)
        navigationController?.navigationBar.backgroundColor = .clear
        addNavigationTapGesture()
    }

    private func setupUI() {
        if contentView.getSubviews().isEmpty {
            viewModel.createCardSliderViewModel()
            if let preSelectedCard = viewModel.getCardSliderViewModel().first {
                selectedCard = preSelectedCard
                viewModel.splitPaymentEnabled = preSelectedCard.amountConfiguration?.splitConfiguration?.splitEnabled ?? false
                viewModel.amountHelper.getPaymentData().payerCost = preSelectedCard.selectedPayerCost
            }
            renderViews()
        }
    }

    private func renderViews() {
        contentView.prepareForRender()

        // Add header view.
        let headerView = getHeaderView(selectedCard: selectedCard)
        self.headerView = headerView
        contentView.addSubviewToBottom(headerView)
        PXLayout.setHeight(owner: headerView, height: PXCardSliderSizeManager.getHeaderViewHeight(viewController: self)).isActive = true
        PXLayout.centerHorizontally(view: headerView).isActive = true
        PXLayout.matchWidth(ofView: headerView).isActive = true

        // Center white View
        let whiteView = getWhiteView()
        self.whiteView  = whiteView
        contentView.addSubviewToBottom(whiteView)
        PXLayout.setHeight(owner: whiteView, height: PXCardSliderSizeManager.getWhiteViewHeight(viewController: self)).isActive = true
        PXLayout.pinLeft(view: whiteView, withMargin: 0).isActive = true
        PXLayout.pinRight(view: whiteView, withMargin: 0).isActive = true

        // Add installment row
        let installmentRow = getInstallmentInfoView()
        whiteView.addSubview(installmentRow)
        PXLayout.pinLeft(view: installmentRow).isActive = true
        PXLayout.pinRight(view: installmentRow).isActive = true
        PXLayout.pinTop(view: installmentRow, withMargin: PXLayout.XXXS_MARGIN).isActive = true

        // Add card slider
        let cardSliderContentView = UIView()
        whiteView.addSubview(cardSliderContentView)
        PXLayout.centerHorizontally(view: cardSliderContentView).isActive = true
        let topMarginConstraint = PXLayout.put(view: cardSliderContentView, onBottomOf: installmentRow, withMargin: 0)
        topMarginConstraint.isActive = true
        cardSliderMarginConstraint = topMarginConstraint

        // CardSlider with GoldenRatio multiplier
        cardSliderContentView.translatesAutoresizingMaskIntoConstraints = false
        let widthSlider: NSLayoutConstraint = cardSliderContentView.widthAnchor.constraint(equalTo: whiteView.widthAnchor)
        widthSlider.isActive = true
        let heightSlider: NSLayoutConstraint = cardSliderContentView.heightAnchor.constraint(equalTo: cardSliderContentView.widthAnchor, multiplier: PXCardSliderSizeManager.goldenRatio)
        heightSlider.isActive = true

        // Add footer payment button.
        if let footerView = getFooterView() {
            whiteView.addSubview(footerView)
            PXLayout.pinLeft(view: footerView, withMargin: PXLayout.M_MARGIN).isActive = true
            PXLayout.pinRight(view: footerView, withMargin: PXLayout.M_MARGIN).isActive = true
            PXLayout.setHeight(owner: footerView, height: PXLayout.XXL_MARGIN).isActive = true
            let bottomMargin = getBottomPayButtonMargin()
            PXLayout.pinBottom(view: footerView, withMargin: bottomMargin).isActive = true
        }

        if let selectedCard = selectedCard, (!selectedCard.status.enabled || selectedCard.cardId == nil) {
            loadingButtonComponent?.setDisabled(animated: false)
        }

        view.layoutIfNeeded()
        let installmentRowWidth: CGFloat = slider.getItemSize(cardSliderContentView).width
        installmentRow.render(installmentRowWidth)

        view.layoutIfNeeded()
        refreshContentViewSize()
        scrollView.isScrollEnabled = false
        scrollView.showsVerticalScrollIndicator = false

        addCardSlider(inContainerView: cardSliderContentView)
    }

    private func getBottomPayButtonMargin() -> CGFloat {
        let safeAreaBottomHeight = PXLayout.getSafeAreaBottomInset()
        if safeAreaBottomHeight > 0 {
            return PXLayout.XXS_MARGIN + safeAreaBottomHeight
        }

        if UIDevice.isSmallDevice() {
            return PXLayout.XS_MARGIN
        }

        return PXLayout.M_MARGIN
    }

    private func removeNavigationTapGesture() {
        if let targetGesture = navigationBarTapGesture {
            navigationController?.navigationBar.removeGestureRecognizer(targetGesture)
        }
    }

    private func addNavigationTapGesture() {
        removeNavigationTapGesture()
        navigationBarTapGesture = UITapGestureRecognizer(target: self, action: #selector(didTapOnNavigationbar))
        if let navTapGesture = navigationBarTapGesture {
            navigationController?.navigationBar.addGestureRecognizer(navTapGesture)
        }
    }
}

// MARK: Components Builders.
extension PXOneTapViewController {
    private func getHeaderView(selectedCard: PXCardSliderViewModel?) -> PXOneTapHeaderView {
        let headerView = PXOneTapHeaderView(viewModel: viewModel.getHeaderViewModel(selectedCard: selectedCard), delegate: self)
        return headerView
    }

    private func getFooterView() -> UIView? {
        loadingButtonComponent = PXAnimatedButton(normalText: "Pagar".localized, loadingText: "Procesando tu pago".localized, retryText: "Reintentar".localized)
        loadingButtonComponent?.animationDelegate = self
        loadingButtonComponent?.layer.cornerRadius = 4
        loadingButtonComponent?.add(for: .touchUpInside, { [weak self] in
            self?.confirmPayment()
        })
        loadingButtonComponent?.setTitle("Pagar".localized, for: .normal)
        loadingButtonComponent?.backgroundColor = ThemeManager.shared.getAccentColor()
        loadingButtonComponent?.accessibilityIdentifier = "pay_button"
        return loadingButtonComponent
    }

    private func getWhiteView() -> UIView {
        let whiteView = UIView()
        whiteView.backgroundColor = .white
        return whiteView
    }

    private func getInstallmentInfoView() -> PXOneTapInstallmentInfoView {
        installmentInfoRow = PXOneTapInstallmentInfoView()
        installmentInfoRow?.update(model: viewModel.getInstallmentInfoViewModel())
        installmentInfoRow?.delegate = self
        if let targetView = installmentInfoRow {
            return targetView
        } else {
            return PXOneTapInstallmentInfoView()
        }
    }

    private func addCardSlider(inContainerView: UIView) {
        slider.render(containerView: inContainerView, cardSliderProtocol: self)
        slider.termsAndCondDelegate = self
        slider.update(viewModel.getCardSliderViewModel())
    }
}

// MARK: User Actions.
extension PXOneTapViewController {
    @objc func didTapOnNavigationbar() {
        didTapMerchantHeader()
    }

    func shouldAddNewOfflineMethod() {
        if let offlineMethods = viewModel.getOfflineMethods() {

            let offlineViewModel = PXOfflineMethodsViewModel(offlinePaymentTypes: offlineMethods.paymentTypes, paymentMethods: viewModel.paymentMethods, amountHelper: viewModel.amountHelper, paymentOptionSelected: viewModel.paymentOptionSelected, advancedConfig: viewModel.advancedConfiguration, userLogged: viewModel.userLogged, disabledOption: viewModel.disabledOption, payerCompliance: viewModel.payerCompliance)

            let vc = PXOfflineMethodsViewController(viewModel: offlineViewModel, callbackConfirm: callbackConfirm, callbackUpdatePaymentOption: callbackUpdatePaymentOption, finishButtonAnimation: finishButtonAnimation) { [weak self] in
                    self?.navigationController?.popViewController(animated: false)
            }

            vc.modalPresentationStyle = .formSheet
            self.present(vc, animated: true, completion: nil)
        }
    }

    private func confirmPayment() {
        if viewModel.shouldValidateWithBiometric() {
            let biometricModule = PXConfiguratorManager.biometricProtocol
            biometricModule.validate(config: PXConfiguratorManager.biometricConfig, onSuccess: { [weak self] in
                DispatchQueue.main.async { [weak self] in
                    self?.doPayment()
                }
                }, onError: { [weak self] _ in
                    // User abort validation or validation fail.
                    self?.trackEvent(path: TrackingPaths.Events.getErrorPath())
            })
        } else {
            doPayment()
        }
    }

    private func doPayment() {
        self.subscribeLoadingButtonToNotifications()
        self.loadingButtonComponent?.startLoading(timeOut: self.timeOutPayButton)
        scrollView.isScrollEnabled = false
        view.isUserInteractionEnabled = false
        if let selectedCardItem = selectedCard {
            viewModel.amountHelper.getPaymentData().payerCost = selectedCardItem.selectedPayerCost
            let properties = viewModel.getConfirmEventProperties(selectedCard: selectedCardItem, selectedIndex: slider.getSelectedIndex())
            trackEvent(path: TrackingPaths.Events.OneTap.getConfirmPath(), properties: properties)
        }
        let splitPayment = viewModel.splitPaymentEnabled
        self.hideBackButton()
        self.hideNavBar()
        self.callbackConfirm(self.viewModel.amountHelper.getPaymentData(), splitPayment)
    }

    func resetButton(error: MPSDKError) {
        loadingButtonComponent?.resetButton()
        loadingButtonComponent?.showErrorToast()
        trackEvent(path: TrackingPaths.Events.getErrorPath(), properties: viewModel.getErrorProperties(error: error))
    }

    private func cancelPayment() {
        self.callbackExit()
    }
}

// MARK: Summary delegate.
extension PXOneTapViewController: PXOneTapHeaderProtocol {

    func splitPaymentSwitchChangedValue(isOn: Bool, isUserSelection: Bool) {
        viewModel.splitPaymentEnabled = isOn
        if isUserSelection {
            self.viewModel.splitPaymentSelectionByUser = isOn
            //Update all models payer cost and selected payer cost
            viewModel.updateAllCardSliderModels(splitPaymentEnabled: isOn)
        }

        if let installmentInfoRow = installmentInfoRow, installmentInfoRow.isExpanded() {
            installmentInfoRow.toggleInstallments()
        }

        //Update installment row
        installmentInfoRow?.update(model: viewModel.getInstallmentInfoViewModel())

        // If it's debit and has split, update split message
        if let infoRow = installmentInfoRow, viewModel.getCardSliderViewModel().indices.contains(infoRow.getActiveRowIndex()) {
            let selectedCard = viewModel.getCardSliderViewModel()[infoRow.getActiveRowIndex()]

            if selectedCard.paymentTypeId == PXPaymentTypes.DEBIT_CARD.rawValue {
                selectedCard.displayMessage = viewModel.getSplitMessageForDebit(amountToPay: selectedCard.selectedPayerCost?.totalAmount ?? 0)
            }

            // Installments arrow animation
            if selectedCard.shouldShowArrow {
                installmentInfoRow?.showArrow()
            } else {
                installmentInfoRow?.hideArrow()
            }
        }
    }

    func didTapMerchantHeader() {
        if let externalVC = viewModel.getExternalViewControllerForSubtitle() {
            PXComponentFactory.Modal.show(viewController: externalVC, title: externalVC.title)
        }
    }

    func didTapCharges() {
        if let vc = viewModel.getChargeRuleViewController() {
            let defaultTitle = "Cargos".localized
            let title = vc.title ?? defaultTitle
            PXComponentFactory.Modal.show(viewController: vc, title: title) { [weak self] in
                if UIDevice.isSmallDevice() {
                    self?.setupNavigationBar()
                }
            }
        }
    }

    func didTapDiscount() {
        var discountReason: PXDiscountReason?

        if let discountConfiguration = viewModel.amountHelper.paymentConfigurationService.getDiscountConfigurationForPaymentMethodOrDefault(selectedCard?.cardId),
            let reason = discountConfiguration.getDiscountConfiguration().reason {
            discountReason = reason
        }

        let discountViewController = PXDiscountDetailViewController(amountHelper: viewModel.amountHelper, discountReason: discountReason)

        if let discount = viewModel.amountHelper.discount {
            PXComponentFactory.Modal.show(viewController: discountViewController, title: discount.getDiscountDescription()) {
                self.setupNavigationBar()
            }
        } else if viewModel.amountHelper.consumedDiscount {
            let modalTitle = discountReason?.title?.message ?? "modal_title_consumed_discount".localized
            PXComponentFactory.Modal.show(viewController: discountViewController, title: modalTitle) {
                self.setupNavigationBar()
            }
        }
    }
}

// MARK: CardSlider delegate.
extension PXOneTapViewController: PXCardSliderProtocol {

    func newCardDidSelected(targetModel: PXCardSliderViewModel) {

        selectedCard = targetModel

        trackEvent(path: TrackingPaths.Events.OneTap.getSwipePath())

        // Installments arrow animation
        if targetModel.shouldShowArrow {
            installmentInfoRow?.showArrow()
        } else {
            installmentInfoRow?.hideArrow()
        }

        // Add card. - card o credits payment method selected
        let validData = targetModel.cardData != nil || targetModel.isCredits
        let shouldDisplay = validData && targetModel.status.enabled
        if shouldDisplay {
            displayCard(targetModel: targetModel)
            loadingButtonComponent?.setEnabled()
        } else {
            displayCard(targetModel: targetModel)
            loadingButtonComponent?.setDisabled()
            headerView?.updateModel(viewModel.getHeaderViewModel(selectedCard: nil))
        }
    }

    func displayCard(targetModel: PXCardSliderViewModel) {
        // New payment method selected.
        let newPaymentMethodId: String = targetModel.paymentMethodId
        let newPayerCost: PXPayerCost? = targetModel.selectedPayerCost

        let currentPaymentData: PXPaymentData = viewModel.amountHelper.getPaymentData()

        if let newPaymentMethod = viewModel.getPaymentMethod(targetId: newPaymentMethodId) {
            currentPaymentData.payerCost = newPayerCost
            currentPaymentData.paymentMethod = newPaymentMethod
            currentPaymentData.issuer = PXIssuer(id: targetModel.issuerId, name: nil)
            callbackUpdatePaymentOption(targetModel)
            loadingButtonComponent?.setEnabled()
        } else {
            currentPaymentData.payerCost = nil
            currentPaymentData.paymentMethod = nil
            currentPaymentData.issuer = nil
            loadingButtonComponent?.setDisabled()
        }
        headerView?.updateModel(viewModel.getHeaderViewModel(selectedCard: selectedCard))

        headerView?.updateSplitPaymentView(splitConfiguration: selectedCard?.amountConfiguration?.splitConfiguration)

        // If it's debit and has split, update split message
        if let totalAmount = targetModel.selectedPayerCost?.totalAmount, targetModel.paymentTypeId == PXPaymentTypes.DEBIT_CARD.rawValue {
            targetModel.displayMessage = viewModel.getSplitMessageForDebit(amountToPay: totalAmount)
        }
    }

    func selectFirstCardInSlider() {
        selectCardInSliderAtIndex(0)
    }

    func selectCardInSliderAtIndex(_ index: Int) {
        let cardSliderViewModel = viewModel.getCardSliderViewModel()
        if cardSliderViewModel.count - 1 >= index && index >= 0 {
            slider.goToItemAt(index: index, animated: false)
            let card = cardSliderViewModel[index]
            newCardDidSelected(targetModel: card)
        }
    }

    func disabledCardDidTap(status: PXStatus) {
        showDisabledCardModal(status: status)
    }

    func showDisabledCardModal(status: PXStatus) {
        guard let message = status.secondaryMessage?.message else {return}
        let vc = PXOneTapDisabledViewController(text: message)

        let buttonTitle = "Pagar con otro medio".localized
        PXComponentFactory.Modal.show(viewController: vc, title: nil, actionTitle: buttonTitle, actionBlock: { [weak self] in

            //Select first item
            self?.selectFirstCardInSlider()
        })

        trackScreen(path: TrackingPaths.Screens.OneTap.getOneTapDisabledModalPath(), treatAsViewController: false)
    }

    func addNewCardDidTap() {
        if viewModel.shouldUseOldCardForm() {
            callbackPaymentData(viewModel.getClearPaymentData())
        } else {
            let builder: MLCardFormBuilder
            if let privateKey = viewModel.privateKey {
                builder = MLCardFormBuilder(privateKey: privateKey, siteId: viewModel.siteId, flowId: PXConfiguratorManager.biometricConfig.flowIdentifier, lifeCycleDelegate: self)
            } else {
                builder = MLCardFormBuilder(publicKey: viewModel.publicKey, siteId: viewModel.siteId, flowId: PXConfiguratorManager.biometricConfig.flowIdentifier, lifeCycleDelegate: self)
            }
            builder.setLanguage(Localizator.sharedInstance.getLanguage())
            builder.setExcludedPaymentTypes(viewModel.excludedPaymentTypeIds)
            builder.setNavigationBarCustomColor(backgroundColor: ThemeManager.shared.navigationBar().backgroundColor, textColor: ThemeManager.shared.navigationBar().tintColor)
            builder.setAnimated(true)
            let cardFormVC = MLCardForm(builder: builder).setupController()
            navigationController?.pushViewController(cardFormVC, animated: true)
        }
    }

    func addNewOfflineDidTap() {
        shouldAddNewOfflineMethod()
    }

    func didScroll(offset: CGPoint) {
        installmentInfoRow?.setSliderOffset(offset: offset)
    }

    func didEndDecelerating() {
        installmentInfoRow?.didEndDecelerating()
    }
}

// MARK: Installment Row Info delegate.
extension PXOneTapViewController: PXOneTapInstallmentInfoViewProtocol, PXOneTapInstallmentsSelectorProtocol {
    func disabledCardTapped(status: PXStatus) {
        showDisabledCardModal(status: status)
    }

    func payerCostSelected(_ payerCost: PXPayerCost) {
        let selectedIndex = slider.getSelectedIndex()
        // Update cardSliderViewModel
        if let infoRow = installmentInfoRow, viewModel.updateCardSliderViewModel(newPayerCost: payerCost, forIndex: infoRow.getActiveRowIndex()) {
            // Update selected payer cost.
            let currentPaymentData: PXPaymentData = viewModel.amountHelper.getPaymentData()
            currentPaymentData.payerCost = payerCost
            // Update installmentInfoRow viewModel
            installmentInfoRow?.update(model: viewModel.getInstallmentInfoViewModel())
            PXFeedbackGenerator.heavyImpactFeedback()

            //Update card bottom message
            let bottomMessage = viewModel.getCardBottomMessage(paymentTypeId: selectedCard?.paymentTypeId, benefits: selectedCard?.benefits, selectedPayerCost: payerCost)
            viewModel.updateCardSliderModel(at: selectedIndex, bottomMessage: bottomMessage)
            slider.update(viewModel.getCardSliderViewModel())
        }
        installmentInfoRow?.toggleInstallments(completion: { [weak self] (_) in
            self?.slider.showBottomMessageIfNeeded(index: selectedIndex, targetIndex: selectedIndex)
        })
    }

    func hideInstallments() {
        self.installmentsSelectorView?.layoutIfNeeded()
        self.installmentInfoRow?.disableTap()

        //Animations
        loadingButtonComponent?.show(duration: 0.1)

        let animationDuration = 0.5

        slider.show(duration: animationDuration)

        var pxAnimator = PXAnimator(duration: animationDuration, dampingRatio: 1)
        pxAnimator.addAnimation(animation: { [weak self] in
            self?.cardSliderMarginConstraint?.constant = 0
            self?.contentView.layoutIfNeeded()
        })

        self.installmentsSelectorView?.collapse(animator: pxAnimator, completion: { [weak self] in
            guard let self = self else { return }
            self.installmentInfoRow?.enableTap()
            self.installmentsSelectorView?.removeFromSuperview()
            self.installmentsSelectorView?.layoutIfNeeded()
        })
    }

    func showInstallments(installmentData: PXInstallment?, selectedPayerCost: PXPayerCost?, interest: PXInstallmentsConfiguration?, reimbursement: PXInstallmentsConfiguration?) {
        guard let installmentData = installmentData, let installmentInfoRow = installmentInfoRow else {
            return
        }

        if let selectedCardItem = selectedCard {
            let properties = self.viewModel.getInstallmentsScreenProperties(installmentData: installmentData, selectedCard: selectedCardItem)
            trackScreen(path: TrackingPaths.Screens.OneTap.getOneTapInstallmentsPath(), properties: properties, treatAsViewController: false)
        }

        PXFeedbackGenerator.selectionFeedback()

        self.installmentsSelectorView?.removeFromSuperview()
        self.installmentsSelectorView?.layoutIfNeeded()
        let viewModel = PXOneTapInstallmentsSelectorViewModel(installmentData: installmentData, selectedPayerCost: selectedPayerCost, interest: interest, reimbursement: reimbursement)
        let installmentsSelectorView = PXOneTapInstallmentsSelectorView(viewModel: viewModel)
        installmentsSelectorView.delegate = self
        self.installmentsSelectorView = installmentsSelectorView

        contentView.addSubview(installmentsSelectorView)
        PXLayout.matchWidth(ofView: installmentsSelectorView).isActive = true
        PXLayout.centerHorizontally(view: installmentsSelectorView).isActive = true
        PXLayout.put(view: installmentsSelectorView, onBottomOf: installmentInfoRow).isActive = true
        let installmentsSelectorViewHeight = PXCardSliderSizeManager.getWhiteViewHeight(viewController: self) - PXOneTapInstallmentInfoView.DEFAULT_ROW_HEIGHT
        PXLayout.setHeight(owner: installmentsSelectorView, height: installmentsSelectorViewHeight).isActive = true

        installmentsSelectorView.layoutIfNeeded()
        self.installmentInfoRow?.disableTap()

        //Animations
        loadingButtonComponent?.hide(duration: 0.1)

        let animationDuration = 0.5
        slider.hide(duration: animationDuration)

        var pxAnimator = PXAnimator(duration: animationDuration, dampingRatio: 1)
        pxAnimator.addAnimation(animation: { [weak self] in
            self?.cardSliderMarginConstraint?.constant = installmentsSelectorViewHeight
            self?.contentView.layoutIfNeeded()
        })

        installmentsSelectorView.expand(animator: pxAnimator) {
            self.installmentInfoRow?.enableTap()
        }
        installmentsSelectorView.tableView.reloadData()
    }
}

// MARK: Payment Button animation delegate
@available(iOS 9.0, *)
extension PXOneTapViewController: PXAnimatedButtonDelegate {
    func shakeDidFinish() {
        displayBackButton()
        scrollView.isScrollEnabled = true
        view.isUserInteractionEnabled = true
        unsubscribeFromNotifications()
        UIView.animate(withDuration: 0.3, animations: {
            self.loadingButtonComponent?.backgroundColor = ThemeManager.shared.getAccentColor()
        })
    }

    func expandAnimationInProgress() {
    }

    func didFinishAnimation() {
        self.finishButtonAnimation()
    }

    func progressButtonAnimationTimeOut() {
        loadingButtonComponent?.resetButton()
        loadingButtonComponent?.showErrorToast()
    }
}

// MARK: Notifications
extension PXOneTapViewController {
    func subscribeLoadingButtonToNotifications() {
        guard let loadingButton = loadingButtonComponent else {
            return
        }
        PXNotificationManager.SuscribeTo.animateButton(loadingButton, selector: #selector(loadingButton.animateFinish))
    }

    func unsubscribeFromNotifications() {
        PXNotificationManager.UnsuscribeTo.animateButton(loadingButtonComponent)
    }
}

// MARK: Terms and Conditions
extension PXOneTapViewController: PXTermsAndConditionViewDelegate {
    func shouldOpenTermsCondition(_ title: String, url: URL) {
        let webVC = WebViewController(url: url, navigationBarTitle: title)
        webVC.title = title
        navigationController?.pushViewController(webVC, animated: true)
    }
}

extension PXOneTapViewController: MLCardFormLifeCycleDelegate {
    func didAddCard(cardID: String) {
        callbackRefreshInit(cardID)
    }

    func didFailAddCard() {
    }
}

extension PXOneTapViewController: UINavigationControllerDelegate {
    func navigationController(_ navigationController: UINavigationController, animationControllerFor operation: UINavigationController.Operation, from fromVC: UIViewController, to toVC: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        if fromVC is MLCardFormViewController || toVC is MLCardFormViewController {
            return PXOneTapViewControllerTransition()
        }
        return nil
    }
}
