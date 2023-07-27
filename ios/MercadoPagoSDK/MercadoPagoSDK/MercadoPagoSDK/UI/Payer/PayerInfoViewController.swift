//
//  PayerInfoViewController.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/29/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PayerInfoViewController: MercadoPagoUIViewController, UITextFieldDelegate, InputComponentListener {

    let KEYBOARD_HEIGHT: CGFloat = 216.0
    let ACCESORY_VIEW_HEIGHT: CGFloat = 44.0
    let INPUT_VIEW_HEIGHT: CGFloat = 83.0

    let NAME_INPUT_TEXT = "payer_info_name"
    let SURNAME_INPUT_TEXT = "payer_info_surname"
    let NUMBER_INPUT_TEXT = "Número"
    let LEGAL_INPUT_TEXT = "payer_info_legal"
    let TYPE_INPUT_TEXT = "Tipo"
    let CONTINUE_INPUT_TEXT = "Continuar"
    let PREVIOUS_INPUT_TEXT = "card_form_previous_button"

    var currentInput: UIView!
    lazy var toolbar: PXToolbar = self.createToolbar()
    var errorLabel: MPLabel?

    // View Components
    var identificationComponent: CompositeInputComponent!
    var secondNameComponent: SimpleInputComponent!
    var firstNameComponent: SimpleInputComponent!
    var legalNameComponent: SimpleInputComponent!
    var boletoComponent: BoletoComponent!

    var viewModel: PayerInfoViewModel!
    var callback : ((_ payer: PXPayer) -> Void)!

    init(viewModel: PayerInfoViewModel, callback: @escaping ((_ payer: PXPayer) -> Void)) {
        super.init(nibName: nil, bundle: nil)
        self.viewModel = viewModel
        self.view.backgroundColor = ThemeManager.shared.getMainColor()
        self.callback = callback
        NotificationCenter.default.addObserver(self, selector: #selector(PayerInfoViewController.keyboardWasShown(_:)), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
        executeStep(PayerInfoFlowStep.SCREEN_IDENTIFICATION)
    }

    func getAvailableHeight() -> CGFloat {
        let screenSize = UIScreen.main.bounds
        let screenHeight = screenSize.height
        var barsHeight = UIApplication.shared.statusBarFrame.height
        let navigationBarHeight = self.navigationController?.navigationBar.frame.height
        barsHeight += navigationBarHeight != nil ? navigationBarHeight! : CGFloat(0.0)
        var availableHeight = screenHeight - barsHeight
        availableHeight = keyboardFrame != nil ? availableHeight - (keyboardFrame?.height)! : availableHeight
        availableHeight -= INPUT_VIEW_HEIGHT
        return availableHeight
    }

    func getDefaultFrame() -> CGRect {
      let screenWidth = UIScreen.main.bounds.width
      let frameIdentification = CGRect(x: 0, y: 0, width: screenWidth, height: 0)
      return frameIdentification
    }

    func initBoletoComponent() {
        let screenWidth = UIScreen.main.bounds.width
        let availableHeight = self.getAvailableHeight()
        let boletoComponentFrame = CGRect(x: 0, y: 0, width: screenWidth, height: availableHeight)
        let boletoType = self.viewModel.boletoType() ?? .cpf
        self.boletoComponent = BoletoComponent(frame: boletoComponentFrame, boletoType: boletoType)
        let type = self.viewModel.identificationType.name
        self.boletoComponent?.setType(text: type!)
        self.boletoComponent?.setNumberPlaceHolder(text: self.viewModel.getMaskedNumber(completeEmptySpaces: true))
        self.view.addSubview(self.boletoComponent!)
    }
    func initFirstNameComponent() {
        let availableHeight = self.getAvailableHeight()
        let nameText = NAME_INPUT_TEXT.localized
        self.firstNameComponent = SimpleInputComponent(frame: getDefaultFrame(), numeric: false, placeholder: nameText, textFieldDelegate: self)
        self.firstNameComponent?.frame.origin.y = availableHeight
        self.firstNameComponent?.delegate = self
        self.view.addSubview(self.firstNameComponent!)
    }
    func initSecondNameComponent() {
        let availableHeight = self.getAvailableHeight()
        let surnameText = SURNAME_INPUT_TEXT.localized
        self.secondNameComponent = SimpleInputComponent(frame: getDefaultFrame(), numeric: false, placeholder: surnameText, textFieldDelegate: self)
        self.secondNameComponent?.frame.origin.y = availableHeight
        self.secondNameComponent?.delegate = self
        self.view.addSubview(self.secondNameComponent!)
    }
    func initLegalNameComponent() {
        let availableHeight = self.getAvailableHeight()
        let nameText = LEGAL_INPUT_TEXT.localized
        self.legalNameComponent = SimpleInputComponent(frame: getDefaultFrame(), numeric: false, placeholder: nameText, textFieldDelegate: self)
        self.legalNameComponent?.frame.origin.y = availableHeight
        self.legalNameComponent?.delegate = self
        self.view.addSubview(self.legalNameComponent!)
    }
    func initIdentificationComponent() {
        let numberText = NUMBER_INPUT_TEXT.localized
        let typeText = TYPE_INPUT_TEXT.localized
        let availableHeight = self.getAvailableHeight()
        self.identificationComponent = CompositeInputComponent(frame: getDefaultFrame(), numeric: true, placeholder: numberText, dropDownPlaceholder: typeText, dropDownOptions: self.viewModel.getDropdownOptions(), textFieldDelegate: self)
        self.identificationComponent?.frame.origin.y = availableHeight
        self.identificationComponent?.delegate = self
        self.identificationComponent?.setText(text: self.viewModel.getMaskedNumber())
        self.view.addSubview(self.identificationComponent!)
    }

    func setupView() {
        if self.identificationComponent == nil && self.boletoComponent == nil {
            self.initializeViews()
        } else {
            self.updateViewFrames()
        }
    }

    fileprivate func getToolbarFrame() -> CGRect {
        return CGRect(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: 44)
    }

    func showToolbarError(message: String) {
        errorLabel!.backgroundColor = UIColor.UIColorFromRGB(0xEEEEEE)
        errorLabel!.textColor = ThemeManager.shared.rejectedColor()
        errorLabel!.text = message
        errorLabel!.textAlignment = .center
        errorLabel!.font = errorLabel!.font.withSize(12)
        self.toolbar.addSubview(errorLabel!)
        trackError(errorMessage: message, currentStep: viewModel.currentStep)
    }

    func hideErrorMessage() {
        self.errorLabel?.removeFromSuperview()
    }

    fileprivate func setUpToolbarErrorMessage() {
        let frame = getToolbarFrame()
        self.errorLabel = MPLabel(frame: frame)
    }

    func initializeViews() {
        self.initIdentificationComponent()
        self.initBoletoComponent()
        self.initFirstNameComponent()
        self.initSecondNameComponent()
        self.initLegalNameComponent()
        self.presentIdentificationComponent()
        setupToolbarButtons()
        setUpToolbarErrorMessage()
    }

    func updateViewFrames() {
        let availableHeight = self.getAvailableHeight()
        self.identificationComponent?.frame.origin.y = availableHeight
        self.secondNameComponent?.frame.origin.y = availableHeight
        self.firstNameComponent?.frame.origin.y = availableHeight
        self.legalNameComponent?.frame.origin.y = availableHeight
        self.boletoComponent?.frame.size.height = availableHeight
        self.boletoComponent?.updateView()
    }

    func setupToolbarButtons() {

        if self.identificationComponent != nil {
            self.identificationComponent?.setInputAccessoryView(inputAccessoryView: self.toolbar)
        }
        if self.secondNameComponent != nil {
            self.secondNameComponent?.setInputAccessoryView(inputAccessoryView: self.toolbar)
        }
        if self.firstNameComponent != nil {
            self.firstNameComponent?.setInputAccessoryView(inputAccessoryView: self.toolbar)
        }
        if self.legalNameComponent != nil {
            self.legalNameComponent?.setInputAccessoryView(inputAccessoryView: self.toolbar)
        }
    }

    func createToolbar() -> PXToolbar {
        let frame = getToolbarFrame()

        let toolbar = PXToolbar(frame: frame)

        toolbar.barStyle = UIBarStyle.default
        toolbar.isUserInteractionEnabled = true

        let buttonNext = UIBarButtonItem(title: CONTINUE_INPUT_TEXT.localized, style: .plain, target: self, action: #selector(PayerInfoViewController.rightArrowKeyTapped))
        let buttonPrev = UIBarButtonItem(title: PREVIOUS_INPUT_TEXT.localized, style: .plain, target: self, action: #selector(PayerInfoViewController.leftArrowKeyTapped))

        buttonNext.setTitlePositionAdjustment(UIOffset(horizontal: UIScreen.main.bounds.size.width / 8, vertical: 0), for: UIBarMetrics.default)
        buttonPrev.setTitlePositionAdjustment(UIOffset(horizontal: -UIScreen.main.bounds.size.width / 8, vertical: 0), for: UIBarMetrics.default)

        let flexibleSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)

        toolbar.items = [flexibleSpace, buttonPrev, flexibleSpace, buttonNext, flexibleSpace]

        return toolbar
    }

    func textChangedIn(component: SimpleInputComponent) {
        hideErrorMessage()
        guard let textField = component.inputTextField else {
            return
        }
        updateViewModelWithInput()

        if component == self.identificationComponent {
            guard self.viewModel.currentMask != nil else {
                return
            }
            textField.text! = self.viewModel.getMaskedNumber()
            let maskComplete = viewModel.getMaskedNumber(completeEmptySpaces: true)
            self.boletoComponent?.setNumber(text: maskComplete)
        } else if component == self.firstNameComponent ||
                component == self.secondNameComponent ||
                component == self.legalNameComponent {
            self.boletoComponent?.setName(text: self.viewModel.displayText())
        }
    }

    func dropDownOptionChanged(text: String) {
        self.viewModel.update(identificationType: text)
        updateBoletoCardVisualState(cleanUp: true)
        presentIdentificationComponent()
    }

    func updateViewModelWithInput() {
        if let number = self.identificationComponent?.getInputText() {
            self.viewModel.update(identificationNumber: number)
        }
        if let name = self.firstNameComponent?.getInputText() {
            self.viewModel.update(name: name)
        }
        if let lastName = self.secondNameComponent?.getInputText() {
            self.viewModel.update(lastName: lastName)
        }
        if let legalName = self.legalNameComponent?.getInputText() {
            self.viewModel.update(legalName: legalName)
        }
        if let identification = self.identificationComponent?.dropDownSelectedOptionText {
            self.viewModel.update(identificationType: identification)
        }
        updateBoletoCardVisualState(cleanUp: false)
    }

    func updateBoletoCardVisualState(cleanUp: Bool) {
        if let type = self.viewModel.boletoType(), let name = self.viewModel.identificationType.name {
            self.boletoComponent?.setType(text: name)
            self.boletoComponent?.boletoType = type
        }
        if cleanUp {
            self.boletoComponent?.setName(text: "")
            self.boletoComponent?.setNumber(text: "")
            self.viewModel.update(identificationNumber: "")
            self.viewModel.update(name: "")
            self.viewModel.update(lastName: "")
            self.viewModel.update(legalName: "")
            self.boletoComponent?.setNumberPlaceHolder(text: self.viewModel.getMaskedNumber(completeEmptySpaces: true))
        }
    }

    fileprivate func executeStep(_ currentStep: PayerInfoFlowStep) {
        trackStep(currentStep: currentStep)
        switch currentStep {
        case .SCREEN_IDENTIFICATION:
             self.presentIdentificationComponent()
        case .SCREEN_NAME:
             self.presentFirstNameComponent()
        case .SCREEN_LAST_NAME:
             self.presentSecondNameComponent()
        case .SCREEN_LEGAL_NAME:
            self.presentLegalNameComponent()
        case .CANCEL:
            self.navigationController?.popViewController(animated: true)
        case .FINISH:
            self.executeCallback()
        }
    }

    @objc func rightArrowKeyTapped() {
        let validStep = self.viewModel.validateCurrentStep()
        if validStep {
            let currentStep = self.viewModel.getNextStep()
            executeStep(currentStep)
        } else {
            showToolbarError(message: "invalid_field".localized)
        }
    }

    @objc func leftArrowKeyTapped() {
        trackBackEvent()
        let currentStep = self.viewModel.getPreviousStep()
        executeStep(currentStep)
    }

    func presentIdentificationComponent() {
        self.view.bringSubviewToFront(self.identificationComponent)
        self.identificationComponent?.componentBecameFirstResponder()
        self.currentInput = self.identificationComponent
    }
    func presentFirstNameComponent() {
        self.view.bringSubviewToFront(self.firstNameComponent)
        self.firstNameComponent?.componentBecameFirstResponder()
        self.currentInput = self.firstNameComponent
    }
    func presentSecondNameComponent() {
        self.view.bringSubviewToFront(self.secondNameComponent)
        self.secondNameComponent?.componentBecameFirstResponder()
        self.currentInput = self.secondNameComponent
    }
    func presentLegalNameComponent() {
        self.view.bringSubviewToFront(self.legalNameComponent)
        self.legalNameComponent?.componentBecameFirstResponder()
        self.currentInput = self.legalNameComponent
    }

    func executeCallback() {
        callback(self.viewModel.getFinalPayer())
    }

    var keyboardFrame: CGRect?

    @objc func keyboardWasShown(_ notification: NSNotification) {
        let info = notification.userInfo!
        let keyboardFrame: CGRect = (info[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        self.keyboardFrame = keyboardFrame
        setupView()
    }
}
