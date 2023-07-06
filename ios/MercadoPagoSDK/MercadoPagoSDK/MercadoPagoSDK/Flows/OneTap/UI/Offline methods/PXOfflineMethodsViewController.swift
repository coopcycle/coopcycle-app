//
//  PXOfflineMethodsViewController.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/12/2019.
//

import Foundation

final class PXOfflineMethodsViewController: MercadoPagoUIViewController {

    let viewModel: PXOfflineMethodsViewModel
    var callbackConfirm: ((PXPaymentData, Bool) -> Void)
    let callbackFinishCheckout: (() -> Void)
    var finishButtonAnimation: (() -> Void)
    var callbackUpdatePaymentOption: ((PaymentMethodOption) -> Void)
    let timeOutPayButton: TimeInterval

    let tableView = UITableView(frame: .zero, style: .grouped)
    var totalLabelConstraint: NSLayoutConstraint?
    let totalViewHeight: CGFloat = 54
    let totalViewMargin: CGFloat = PXLayout.S_MARGIN
    var loadingButtonComponent: PXAnimatedButton?
    var inactivityView: UIView?
    var inactivityViewAnimationConstraint: NSLayoutConstraint?

    var userDidScroll = false

    init(viewModel: PXOfflineMethodsViewModel, callbackConfirm: @escaping ((PXPaymentData, Bool) -> Void), callbackUpdatePaymentOption: @escaping ((PaymentMethodOption) -> Void), finishButtonAnimation: @escaping (() -> Void), callbackFinishCheckout: @escaping (() -> Void)) {
        self.viewModel = viewModel
        self.callbackConfirm = callbackConfirm
        self.callbackUpdatePaymentOption = callbackUpdatePaymentOption
        self.finishButtonAnimation = finishButtonAnimation
        self.callbackFinishCheckout = callbackFinishCheckout
        self.timeOutPayButton = 15
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        render()

        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
            self?.showInactivityViewIfNecessary()
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        animateTotalLabel()
        trackScreen(path: TrackingPaths.Screens.OneTap.getOfflineMethodsPath(), properties: viewModel.getScreenTrackingProperties())
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        trackAbortEvent()
    }

    func animateTotalLabel() {
        view.layoutIfNeeded()
        let animator = UIViewPropertyAnimator(duration: 0.5, dampingRatio: 1) { [weak self] in
            self?.totalLabelConstraint?.constant = self?.totalViewMargin ?? PXLayout.S_MARGIN
            self?.view.layoutIfNeeded()
        }
        animator.startAnimation()
    }

    func getTopInset() -> CGFloat {
        if #available(iOS 13.0, *) {
            return 0
        } else {
            return PXLayout.getStatusBarHeight()
        }
    }

    func render() {
        view.backgroundColor = ThemeManager.shared.navigationBar().backgroundColor

        let totalView = renderTotalView()
        view.addSubview(totalView)

        //Total view layout
        NSLayoutConstraint.activate([
            totalView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            totalView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            totalView.topAnchor.constraint(equalTo: view.topAnchor, constant: getTopInset()),
            totalView.heightAnchor.constraint(equalToConstant: totalViewHeight)
        ])

        let footerView = getFooterView()
        view.addSubview(footerView)

        //Footer view layout
        NSLayoutConstraint.activate([
            footerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            footerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            footerView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        tableView.register(PXOfflineMethodsCell.self, forCellReuseIdentifier: PXOfflineMethodsCell.identifier)
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.delegate = self
        tableView.dataSource = self
        tableView.separatorInset = .init(top: 0, left: PXLayout.S_MARGIN, bottom: 0, right: PXLayout.S_MARGIN)
        tableView.separatorColor = UIColor.black.withAlphaComponent(0.1)
        tableView.backgroundColor = .white
        view.addSubview(tableView)

        NSLayoutConstraint.activate([
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.topAnchor.constraint(equalTo: totalView.bottomAnchor),
            tableView.bottomAnchor.constraint(equalTo: footerView.topAnchor)
        ])
        tableView.reloadData()

        //Inactivity View - rendered but hidden
        renderInactivityView(text: viewModel.getTitleForLastSection())
        view.bringSubviewToFront(footerView)
    }

    func renderTotalView() -> UIView {
        let totalView = UIView()
        totalView.translatesAutoresizingMaskIntoConstraints = false
        totalView.backgroundColor = ThemeManager.shared.navigationBar().backgroundColor

        let totalLabel = UILabel()
        totalLabel.translatesAutoresizingMaskIntoConstraints = false
        totalLabel.attributedText = viewModel.getTotalTitle().getAttributedString(fontSize: PXLayout.M_FONT, textColor: ThemeManager.shared.navigationBar().getTintColor())
        totalLabel.textAlignment = .right

        totalView.addSubview(totalLabel)

        NSLayoutConstraint.activate([
            totalLabel.leadingAnchor.constraint(equalTo: totalView.leadingAnchor, constant: totalViewMargin),
            totalLabel.trailingAnchor.constraint(equalTo: totalView.trailingAnchor, constant: -totalViewMargin),
            totalLabel.heightAnchor.constraint(equalToConstant: totalViewHeight - (totalViewMargin*2))
        ])

        totalLabelConstraint = totalLabel.topAnchor.constraint(equalTo: totalView.topAnchor, constant: totalViewMargin + totalViewHeight)
        totalLabelConstraint?.isActive = true

        //Close button
        let closeButton = UIButton()
        let closeImage = ResourceManager.shared.getImage("result-close-button")?.imageWithOverlayTint(tintColor: ThemeManager.shared.navigationBar().getTintColor())
        closeButton.setImage(closeImage, for: .normal)
        closeButton.translatesAutoresizingMaskIntoConstraints = false
        closeButton.add(for: .touchUpInside) { [weak self] in
            self?.dismiss(animated: true, completion: nil)
            PXFeedbackGenerator.mediumImpactFeedback()
        }

        totalView.addSubview(closeButton)

        NSLayoutConstraint.activate([
            closeButton.leadingAnchor.constraint(equalTo: totalView.leadingAnchor),
            closeButton.heightAnchor.constraint(equalToConstant: totalViewHeight),
            closeButton.widthAnchor.constraint(equalToConstant: totalViewHeight),
            closeButton.centerYAnchor.constraint(equalTo: totalView.centerYAnchor)
        ])

        return totalView
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

    private func getFooterView() -> UIView {
        let footerContainer = UIView()
        footerContainer.translatesAutoresizingMaskIntoConstraints = false
        footerContainer.backgroundColor = .white

        let loadingButtonComponent = PXAnimatedButton(normalText: "Pagar".localized, loadingText: "Procesando tu pago".localized, retryText: "Reintentar".localized)
        self.loadingButtonComponent = loadingButtonComponent
        loadingButtonComponent.animationDelegate = self
        loadingButtonComponent.layer.cornerRadius = 4
        loadingButtonComponent.add(for: .touchUpInside, { [weak self] in
            guard let self = self else { return }
            self.confirmPayment()
        })
        loadingButtonComponent.setTitle("Pagar".localized, for: .normal)
        loadingButtonComponent.backgroundColor = ThemeManager.shared.getAccentColor()
        loadingButtonComponent.accessibilityIdentifier = "pay_button"
        loadingButtonComponent.setDisabled()

        footerContainer.addSubview(loadingButtonComponent)

        NSLayoutConstraint.activate([
            loadingButtonComponent.topAnchor.constraint(equalTo: footerContainer.topAnchor, constant: PXLayout.S_MARGIN),
            loadingButtonComponent.bottomAnchor.constraint(greaterThanOrEqualTo: footerContainer.bottomAnchor, constant: -getBottomPayButtonMargin()),
            loadingButtonComponent.leadingAnchor.constraint(equalTo: footerContainer.leadingAnchor, constant: PXLayout.M_MARGIN),
            loadingButtonComponent.trailingAnchor.constraint(equalTo: footerContainer.trailingAnchor, constant: -PXLayout.M_MARGIN)
        ])

        PXLayout.setHeight(owner: loadingButtonComponent, height: PXLayout.XXL_MARGIN).isActive = true

        footerContainer.dropShadow()

        return footerContainer
    }
}

// MARK: Inactivity view methods
extension PXOfflineMethodsViewController {
    func showInactivityView(animated: Bool = true) {
        self.inactivityView?.isHidden = false
        let animator = UIViewPropertyAnimator(duration: animated ? 0.3 : 0, dampingRatio: 1) {
            self.inactivityViewAnimationConstraint?.constant = -PXLayout.XS_MARGIN
            self.inactivityView?.alpha = 1
            self.view.layoutIfNeeded()
        }
        animator.startAnimation()
    }

    func hideInactivityView(animated: Bool = true) {
        let animator = UIViewPropertyAnimator(duration: animated ? 0.3 : 0, dampingRatio: 1) {
            self.inactivityViewAnimationConstraint?.constant = PXLayout.M_MARGIN
            self.inactivityView?.alpha = 0
            self.view.layoutIfNeeded()
        }
        self.inactivityView?.isHidden = true
        animator.startAnimation()
    }

    func showInactivityViewIfNecessary() {
        if let inactivityView = inactivityView, inactivityView.isHidden, !userDidScroll, hasHiddenPaymentTypes() {
            showInactivityView()
        }
    }

    func hideInactivityViewIfNecessary() {
        if let inactivityView = inactivityView, !inactivityView.isHidden, userDidScroll, !hasHiddenPaymentTypes() {
            hideInactivityView()
        }
    }

    func hasHiddenPaymentTypes() -> Bool {
        guard let indexPathsForVisibleRows = tableView.indexPathsForVisibleRows else {return false}

        let visibleRowsLastSection = indexPathsForVisibleRows.filter { (indexPath) -> Bool in
            return indexPath.section == viewModel.numberOfSections() - 1
        }

        return visibleRowsLastSection.isEmpty
    }

    func renderInactivityView(text: String?) {
        let viewHeight: CGFloat = 28
        let imageSize: CGFloat = 16
        let inactivityView = UIView()
        inactivityView.translatesAutoresizingMaskIntoConstraints = false
        inactivityView.backgroundColor = ThemeManager.shared.navigationBar().backgroundColor
        inactivityView.layer.cornerRadius = viewHeight/2

        view.addSubview(inactivityView)
        NSLayoutConstraint.activate([
            inactivityView.heightAnchor.constraint(equalToConstant: viewHeight),
            inactivityView.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])

        let bottomConstraint = inactivityView.bottomAnchor.constraint(equalTo: tableView.bottomAnchor, constant: -PXLayout.XS_MARGIN)
        bottomConstraint.isActive = true

        self.inactivityView = inactivityView
        self.inactivityViewAnimationConstraint = bottomConstraint

        let arrowImage = ResourceManager.shared.getImage("inactivity_indicator")?.imageWithOverlayTint(tintColor: ThemeManager.shared.navigationBar().getTintColor())
        let imageView = UIImageView(image: arrowImage)
        imageView.translatesAutoresizingMaskIntoConstraints = false

        view.addSubview(imageView)
        NSLayoutConstraint.activate([
            imageView.leadingAnchor.constraint(equalTo: inactivityView.leadingAnchor, constant: PXLayout.XS_MARGIN),
            imageView.centerYAnchor.constraint(equalTo: inactivityView.centerYAnchor),
            imageView.heightAnchor.constraint(equalToConstant: imageSize),
            imageView.widthAnchor.constraint(equalToConstant: imageSize)
        ])

        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.textColor = ThemeManager.shared.navigationBar().getTintColor()
        label.font = UIFont.ml_regularSystemFont(ofSize: PXLayout.XXXS_FONT)
        label.text = text

        inactivityView.addSubview(label)
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: imageView.trailingAnchor, constant: PXLayout.XXS_MARGIN),
            label.trailingAnchor.constraint(equalTo: inactivityView.trailingAnchor, constant: -PXLayout.XS_MARGIN),
            label.topAnchor.constraint(equalTo: inactivityView.topAnchor, constant: PXLayout.XXS_MARGIN),
            label.bottomAnchor.constraint(equalTo: inactivityView.bottomAnchor, constant: -PXLayout.XXS_MARGIN)
        ])

        hideInactivityView(animated: false)
    }
}

// MARK: UITableViewDelegate & DataSource
extension PXOfflineMethodsViewController: UITableViewDelegate, UITableViewDataSource, UIScrollViewDelegate {

    func numberOfSections(in tableView: UITableView) -> Int {
        return viewModel.numberOfSections()
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return viewModel.numberOfRowsInSection(section)
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if let cell = tableView.dequeueReusableCell(withIdentifier: PXOfflineMethodsCell.identifier, for: indexPath) as? PXOfflineMethodsCell {
            let data = viewModel.dataForCellAt(indexPath)
            cell.render(data: data)
            return cell
        }
        return UITableViewCell()
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let title = viewModel.headerTitleForSection(section)
        let view = UIView()
        view.backgroundColor = .white
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.attributedText = title?.getAttributedString(fontSize: PXLayout.XXS_FONT)
        view.addSubview(label)

        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: PXLayout.S_MARGIN),
            label.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: PXLayout.S_MARGIN),
            label.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -PXLayout.XS_MARGIN)
        ])

        return view
    }

    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 55
    }

    func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return CGFloat.leastNormalMagnitude
    }

    func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        return UIView(frame: .zero)
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return viewModel.heightForRowAt(indexPath)
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        viewModel.selectedIndexPath = indexPath
        tableView.reloadData()
        PXFeedbackGenerator.selectionFeedback()

        if viewModel.selectedIndexPath != nil {
            loadingButtonComponent?.setEnabled()
        } else {
            loadingButtonComponent?.setDisabled()
        }

        if let selectedPaymentOption = viewModel.getSelectedOfflineMethod() {
            callbackUpdatePaymentOption(selectedPaymentOption)
        }
    }

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        userDidScroll = true
        hideInactivityViewIfNecessary()
    }
}

// MARK: Payment Button animation delegate
@available(iOS 9.0, *)
extension PXOfflineMethodsViewController: PXAnimatedButtonDelegate {
    func shakeDidFinish() {
        displayBackButton()
        tableView.isScrollEnabled = true
        view.isUserInteractionEnabled = true
        unsubscribeFromNotifications()
        UIView.animate(withDuration: 0.3, animations: {
            self.loadingButtonComponent?.backgroundColor = ThemeManager.shared.getAccentColor()
        })
    }

    func expandAnimationInProgress() {
    }

    func didFinishAnimation() {
        self.dismiss(animated: true, completion: nil)
        self.finishButtonAnimation()
    }

    func progressButtonAnimationTimeOut() {
        loadingButtonComponent?.resetButton()
        loadingButtonComponent?.showErrorToast()
    }

    private func confirmPayment() {
        if viewModel.shouldValidateWithBiometric() {
            let biometricModule = PXConfiguratorManager.biometricProtocol
            biometricModule.validate(config: PXConfiguratorManager.biometricConfig, onSuccess: { [weak self] in
                DispatchQueue.main.async {
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
        if shouldAnimateButton() {
            self.subscribeLoadingButtonToNotifications()
            self.loadingButtonComponent?.startLoading(timeOut: self.timeOutPayButton)
            tableView.isScrollEnabled = false
            view.isUserInteractionEnabled = false
        }

        if let selectedOfflineMethod = viewModel.getSelectedOfflineMethod(), let newPaymentMethod = viewModel.getOfflinePaymentMethod(targetOfflinePaymentMethod: selectedOfflineMethod) {
            let currentPaymentData: PXPaymentData = viewModel.amountHelper.getPaymentData()
            currentPaymentData.payerCost = nil
            currentPaymentData.paymentMethod = newPaymentMethod
            currentPaymentData.issuer = nil
            trackEvent(path: TrackingPaths.Events.OneTap.getConfirmPath(), properties: viewModel.getEventTrackingProperties(selectedOfflineMethod))
            if let payerCompliance = viewModel.getPayerCompliance(), payerCompliance.offlineMethods.isCompliant {
                currentPaymentData.payer?.firstName = viewModel.getPayerFirstName()
                currentPaymentData.payer?.lastName = viewModel.getPayerLastName()
                currentPaymentData.payer?.identification = viewModel.getPayerIdentification()
            }
        }

        let splitPayment = false
        self.hideBackButton()
        self.hideNavBar()
        self.callbackConfirm(self.viewModel.amountHelper.getPaymentData(), splitPayment)

        if shouldShowKyC() {
            dismiss(animated: false, completion: nil)
            callbackFinishCheckout()
        }
    }

    private func shouldAnimateButton() -> Bool {
        return !shouldShowKyC()
    }

    private func shouldShowKyC() -> Bool {
        if let selectedOfflineMethod = viewModel.getSelectedOfflineMethod(), selectedOfflineMethod.hasAdditionalInfoNeeded,
            let compliant = viewModel.getPayerCompliance()?.offlineMethods.isCompliant, !compliant {
            return true
        }
        return false
    }
}

// MARK: Notifications
extension PXOfflineMethodsViewController {
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
