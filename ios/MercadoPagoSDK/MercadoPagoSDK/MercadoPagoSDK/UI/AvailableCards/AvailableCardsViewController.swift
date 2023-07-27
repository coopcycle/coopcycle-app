//
//  AvailableCardsViewController.swift
//  Pods
//
//  Created by Angie Arlanti on 8/28/17.
//
//

import UIKit

@objcMembers
internal class AvailableCardsViewController: MercadoPagoUIViewController {

    let buttonFontSize: CGFloat = 18

    @IBOutlet weak var retryButton: UIButton!

    var availableCardsDetailView: AvailableCardsDetailView!
    var viewModel: AvailableCardsViewModel!

    init(paymentMethods: [PXPaymentMethod], callbackCancel: (() -> Void)? = nil) {
        super.init(nibName: "AvailableCardsViewController", bundle: ResourceManager.shared.getBundle())
        self.callbackCancel = callbackCancel
        self.viewModel = AvailableCardsViewModel(paymentMethods: paymentMethods)
    }

    init(viewModel: AvailableCardsViewModel, callbackCancel: (() -> Void)? = nil) {
        super.init(nibName: "AvailableCardsViewController", bundle: ResourceManager.shared.getBundle())
        self.callbackCancel = callbackCancel
        self.viewModel = viewModel
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override open func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = ThemeManager.shared.modalComponent().backgroundColor

        self.availableCardsDetailView = AvailableCardsDetailView(frame: self.viewModel.getDatailViewFrame(), paymentMethods: self.viewModel.paymentMethods)
        self.availableCardsDetailView.layer.cornerRadius = 4
        self.availableCardsDetailView.layer.masksToBounds = true
        self.view.addSubview(self.availableCardsDetailView)

        self.retryButton.setTitle(viewModel.getEnterCardMessage(), for: .normal)
        self.retryButton.setTitleColor(ThemeManager.shared.modalComponent().tintColor, for: .normal)
        self.retryButton.titleLabel?.font = Utils.getFont(size: buttonFontSize)
    }

    override open func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        trackScreen()
    }

    @IBAction func exit() {
        guard let callbackCancel = self.callbackCancel else {
            self.dismiss(animated: true, completion: nil)
            return
        }
        self.dismiss(animated: true) {
            callbackCancel()
        }

    }
}

// MARK: Tracking
extension AvailableCardsViewController {
    func trackScreen() {
        trackScreen(path: TrackingPaths.Screens.getAvailablePaymentMethodsPath())
    }
}
