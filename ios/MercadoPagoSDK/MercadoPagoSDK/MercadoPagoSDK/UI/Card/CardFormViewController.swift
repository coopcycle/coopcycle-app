//
//  CardFormViewController.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 1/18/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

private func < <T: Comparable>(lhs: T?, rhs: T?) -> Bool {
    switch (lhs, rhs) {
    case let (l__?, r__?):
        return l__ < r__
    case (nil, _?):
        return true
    default:
        return false
    }
}

internal class CardFormViewController: MercadoPagoUIViewController, UITextFieldDelegate {

    typealias CompletionHandler = () -> Void

    enum DisplayCardState {
        case frontSide
        case backSide
    }

    let NAVIGATION_BAR_COLOR = ThemeManager.shared.navigationBar().backgroundColor
    let NAVIGATION_BAR_TEXT_COLOR = ThemeManager.shared.navigationBar().tintColor

    @IBOutlet weak var keyboardHeightConstraint: NSLayoutConstraint!
    @IBOutlet weak var cardBackground: UIView!
    var cardView: UIView!
    @IBOutlet weak var textBox: HoshiTextField!
    var cardViewBack: UIView?
    var cardFront: CardFrontView?
    var cardBack: CardBackView?
    var cardNumberLabel: UILabel?
    var numberLabelEmpty: Bool = true
    var nameLabel: MPLabel?
    var expirationDateLabel: MPLabel?
    var expirationLabelEmpty: Bool = true
    var cvvLabel: UILabel?
    var editingLabel: UILabel?
    var callback : (( _ paymentMethods: [PXPaymentMethod], _ cardtoken: PXCardToken?) -> Void)?

    var textMaskFormater = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX")
    var textEditMaskFormater = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX", completeEmptySpaces: false)

    private var isShowingTextBoxMessage = false
    var toolbar: PXToolbar?
    var errorLabel: MPLabel?
    var navItem: UINavigationItem?
    var viewModel: CardFormViewModel!
    var displayCardState: DisplayCardState = .frontSide

    init(cardFormManager: CardFormViewModel, callback : @escaping ((_ paymentMethod: [PXPaymentMethod], _ cardToken: PXCardToken?) -> Void), callbackCancel: (() -> Void)? = nil) {
        super.init(nibName: "CardFormViewController", bundle: ResourceManager.shared.getBundle())
        self.viewModel = cardFormManager
        self.callback = callback
    }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }

    override func loadMPStyles() {
        if self.navigationController != nil {

            //Navigation bar colors
            var titleDict: NSDictionary = [:]
            //Navigation bar colors
            let fontChosed = Utils.getFont(size: 18)
            titleDict = [NSAttributedString.Key.foregroundColor: NAVIGATION_BAR_TEXT_COLOR, NSAttributedString.Key.font: fontChosed]

            if self.navigationController != nil {
                self.navigationController!.navigationBar.titleTextAttributes = titleDict as? [NSAttributedString.Key: AnyObject]
                self.navigationItem.hidesBackButton = true
                self.navigationController?.navigationBar.barTintColor = NAVIGATION_BAR_COLOR
                self.navigationController?.navigationBar.removeBottomLine()
                self.navigationController?.navigationBar.isTranslucent = false
                self.cardBackground.backgroundColor = NAVIGATION_BAR_COLOR

                if viewModel.showBankDeals() {
                    let promocionesButton: UIBarButtonItem = UIBarButtonItem(title: "Ver promociones".localized, style: UIBarButtonItem.Style.plain, target: self, action: #selector(CardFormViewController.verPromociones))
                    promocionesButton.tintColor = NAVIGATION_BAR_TEXT_COLOR
                    self.navigationItem.rightBarButtonItem = promocionesButton
                }
                displayBackButton()
            }
        }

    }

    public init(paymentSettings: PXPaymentPreference?, token: PXToken? = nil, cardInformation: PXCardInformation? = nil, paymentMethods: [PXPaymentMethod], mercadoPagoServicesAdapter: MercadoPagoServicesAdapter?, callback : @escaping ((_ paymentMethod: [PXPaymentMethod], _ cardToken: PXCardToken?) -> Void), callbackCancel: (() -> Void)? = nil, bankDealsEnabled: Bool) {
        super.init(nibName: "CardFormViewController", bundle: ResourceManager.shared.getBundle())
        self.viewModel = CardFormViewModel(paymentMethods: paymentMethods, customerCard: cardInformation, token: token, mercadoPagoServicesAdapter: mercadoPagoServicesAdapter, bankDealsEnabled: bankDealsEnabled)
        self.callbackCancel = callbackCancel
        self.callback = callback
    }

    override public init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }

    open override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        updateLabelsFontColors()
        textEditMaskFormater.emptyMaskElement = nil
    }

    open override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        self.trackScreen()

        if self.navigationController != nil {
            if viewModel.showBankDeals() {
                let promocionesButton: UIBarButtonItem = UIBarButtonItem(title: "Ver promociones".localized, style: UIBarButtonItem.Style.plain, target: self, action: #selector(CardFormViewController.verPromociones))
                promocionesButton.tintColor = NAVIGATION_BAR_TEXT_COLOR
                self.navigationItem.rightBarButtonItem = promocionesButton
            }
        }
        self.showNavBar()
        textBox.becomeFirstResponder()
        self.updateCardSkin()

        if self.viewModel.customerCard != nil {

            let textMaskFormaterAux = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX", completeEmptySpaces: true)
            self.cardNumberLabel?.text = textMaskFormaterAux.textMasked(self.viewModel.customerCard?.getCardBin(), remasked: false)
            self.cardNumberLabel?.text = textMaskFormaterAux.textMasked(self.viewModel.customerCard?.getCardBin(), remasked: false)
            self.prepareCVVLabelForEdit()
        } else if viewModel.token != nil {
            let textMaskFormaterAux = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX", completeEmptySpaces: true)
            self.cardNumberLabel?.text = textMaskFormaterAux.textMasked(viewModel.token?.firstSixDigits, remasked: false)
            self.cardNumberLabel?.text = textMaskFormaterAux.textMasked(viewModel.token?.firstSixDigits, remasked: false)
            self.prepareCVVLabelForEdit()
        }
    }

    override open func viewDidLoad() {
        super.viewDidLoad()
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        PXNotificationManager.SuscribeTo.cardFormReset(self, selector: #selector(reset))
        if viewModel.bankDealsEnabled {
            self.getPromos()
        }
        textBox.borderInactiveColor = ThemeManager.shared.secondaryColor()
        textBox.borderActiveColor = ThemeManager.shared.secondaryColor()
        textBox.autocorrectionType = UITextAutocorrectionType.no
        textBox.keyboardType = UIKeyboardType.numberPad
        textBox.keyboardAppearance = .light
        textBox.addTarget(self, action: #selector(CardFormViewController.editingChanged(_:)), for: UIControl.Event.editingChanged)
        setupInputAccessoryView()
        textBox.delegate = self
        cardFront = CardFrontView()
        cardBack = CardBackView()
        self.cardView = UIView()

        let cardHeight = getCardHeight()
        let cardWidht = getCardWidth()
        let xMargin = (UIScreen.main.bounds.size.width - cardWidht) / 2
        let yMargin = (UIScreen.main.bounds.size.height - 384 - cardHeight ) / 2

        let rectBackground = CGRect(x: xMargin, y: yMargin, width: cardWidht, height: cardHeight)
        let rect = CGRect(x: 0, y: 0, width: cardWidht, height: cardHeight)

        self.cardView.frame = rectBackground
        cardFront?.frame = rect
        cardBack?.frame = rect
        self.cardView.backgroundColor = UIColor.UIColorFromRGB(0xEEEEEE)
        self.cardView.layer.cornerRadius = 11
        self.cardView.layer.masksToBounds = true
        self.cardBackground.addSubview(self.cardView)

        PXLayout.setWidth(owner: cardView, width: cardWidht).isActive = true
        PXLayout.setHeight(owner: cardView, height: cardHeight).isActive = true
        _ = PXLayout.pinLeft(view: cardView, to: cardBackground, withMargin: xMargin)
        _ = PXLayout.pinTop(view: cardView, to: cardBackground, withMargin: yMargin)

        cardBack!.backgroundColor = UIColor.clear

        cardNumberLabel = cardFront?.cardNumber
        nameLabel = cardFront?.cardName
        expirationDateLabel = cardFront?.cardExpirationDate
        cvvLabel = cardBack?.cardCVV

        cardNumberLabel?.text = textMaskFormater.textMasked("")
        nameLabel?.text = "NOMBRE APELLIDO".localized
        expirationDateLabel?.text = "MM/AA".localized
        cvvLabel?.text = "•••"
        editingLabel = cardNumberLabel

        view.setNeedsUpdateConstraints()
        cardView.addSubview(cardFront!)
        textBox.placeholder = getTextboxPlaceholder()

        PXLayout.setWidth(owner: cardFront!, width: cardWidht).isActive = true
        PXLayout.setHeight(owner: cardFront!, height: cardHeight).isActive = true
        PXLayout.centerVertically(view: cardFront!, to: cardView, withMargin: 0).isActive = true
        PXLayout.centerHorizontally(view: cardFront!, to: cardView).isActive = true

        cardView.addSubview(cardBack!)
        PXLayout.setWidth(owner: cardBack!, width: cardWidht).isActive = true
        PXLayout.setHeight(owner: cardBack!, height: cardHeight).isActive = true
        PXLayout.centerVertically(view: cardBack!, to: cardView, withMargin: 0).isActive = true
        PXLayout.centerHorizontally(view: cardBack!, to: cardView).isActive = true
        cardBack!.isHidden = true
    }
    @objc func keyboardWillShow(notification: Notification) {
        if let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            self.keyboardHeightConstraint.constant = keyboardSize.height - 40
            self.view.layoutIfNeeded()
            self.view.setNeedsUpdateConstraints()
        }
    }

    private func getPromos() {
        if let mercadoPagoServicesAdapter = self.viewModel.mercadoPagoServicesAdapter {
            mercadoPagoServicesAdapter.getBankDeals(callback: { (bankDeals) in
                self.viewModel.promos = bankDeals
                self.updateCardSkin()
            }, failure: { _ in
                // Si no se pudieron obtener promociones se ignora tal caso
                self.viewModel.bankDealsEnabled = false
                self.updateCardSkin()
            })
        }
    }

    func getCardWidth() -> CGFloat {
        let widthTotal = UIScreen.main.bounds.size.width * 0.70
        if widthTotal < 512 {
            if (0.63 * widthTotal) < (UIScreen.main.bounds.size.height - 394) {
                return widthTotal
            } else {
                return (UIScreen.main.bounds.size.height - 394) / 0.63
            }

        } else {
            return 512
        }
    }

    func getCardHeight() -> CGFloat {
        return ( getCardWidth() * 0.63 )
    }

    open func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        let value: Bool = validateInput(textField, shouldChangeCharactersInRange: range, replacementString: string)
        updateLabelsFontColors()
        return value
    }

    @objc open func verPromociones() {
        guard let promos = self.viewModel.promos else {
            return
        }
        self.navigationController?.pushViewController(self.startPromosStep(promos: promos), animated: true)
    }

    func startPromosStep(promos: [PXBankDeal],
                         _ callback: (() -> Void)? = nil) -> PXBankDealsViewController {

        let viewModel = PXBankDealsViewModel(bankDeals: promos)
        return PXBankDealsViewController(viewModel: viewModel)
    }

    @objc open func editingChanged(_ textField: UITextField) {
        if isShowingTextBoxMessage {
            hideMessage()
        }
        if editingLabel == cardNumberLabel {
            showOnlyOneCardMessage()
            editingLabel?.text = textMaskFormater.textMasked(textEditMaskFormater.textUnmasked(textField.text!))
            textField.text! = textEditMaskFormater.textMasked(textField.text!, remasked: true)
            self.updateCardSkin()
            updateLabelsFontColors()
        } else if editingLabel == nameLabel {
            editingLabel?.text = formatName(textField.text!)
            updateLabelsFontColors()
        } else if editingLabel == expirationDateLabel {
            editingLabel?.text = formatExpirationDate(textField.text!)

            updateLabelsFontColors()
        } else {
            editingLabel?.text = textField.text!
            completeCvvLabel()
        }
    }

    open func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if editingLabel == cardNumberLabel, validateCardNumber() {
            self.prepareNameLabelForEdit()
        } else if editingLabel == nameLabel, validateCardholderName() {
            self.prepareExpirationLabelForEdit()
        } else if editingLabel == expirationDateLabel, validateExpirationDate() {
            self.prepareCVVLabelForEdit()
        } else if editingLabel == cvvLabel, validateCvv() {
            self.rightArrowKeyTapped()
        }
        return true
    }

    /* Metodos para formatear el texto ingresado de forma que se muestre
     de forma adecuada dependiendo de cada campo de texto */

    fileprivate func formatName(_ name: String) -> String {
        if name.count == 0 {
            self.viewModel.cardholderNameEmpty = true
            return "NOMBRE APELLIDO".localized
        }
        self.viewModel.cardholderNameEmpty = false
        return name.uppercased()
    }

    fileprivate func formatCVV(_ cvv: String) -> String {
        completeCvvLabel()
        return cvv
    }

    fileprivate func formatExpirationDate(_ expirationDate: String) -> String {
        if expirationDate.count == 0 {
            expirationLabelEmpty = true
            return "MM/AA".localized
        }
        expirationLabelEmpty = false
        return expirationDate
    }

    /* Metodos para preparar los diferentes labels del formulario para ser editados */
    fileprivate func prepareNumberLabelForEdit() {
        editingLabel = cardNumberLabel
        viewModel.cardToken = nil
        textBox.resignFirstResponder()
        textBox.keyboardType = UIKeyboardType.numberPad
        textBox.becomeFirstResponder()
        textBox.text = textEditMaskFormater.textMasked(cardNumberLabel!.text?.trimSpaces())
        textBox.placeholder = getTextboxPlaceholder()
        self.trackScreen()
    }
    fileprivate func prepareNameLabelForEdit() {
        editingLabel = nameLabel
        textBox.resignFirstResponder()
        textBox.keyboardType = UIKeyboardType.alphabet
        textBox.becomeFirstResponder()
        textBox.text = viewModel.cardholderNameEmpty ?  "" : nameLabel!.text!.replacingOccurrences(of: " ", with: "")
        textBox.placeholder = getTextboxPlaceholder()
        self.trackScreen()
    }

    fileprivate func prepareExpirationLabelForEdit() {
        //this function may be executed along with the showFrontCard action
        editingLabel = expirationDateLabel
        textBox.resignFirstResponder()
        textBox.keyboardType = UIKeyboardType.numberPad
        textBox.becomeFirstResponder()
        textBox.text = expirationLabelEmpty ?  "" : expirationDateLabel!.text
        textBox.placeholder = getTextboxPlaceholder()
        self.trackScreen()
    }

    fileprivate func prepareCVVLabelForEdit() {
        //this function may be executed along with the showBackCard action
        if !self.viewModel.isAmexCard(self.cardNumberLabel!.text!) {
            showBackCardSideIfNeeded(completion: { [weak self] in
                guard let self = self else { return }
                self.updateLabelsFontColors()
                self.cvvLabel = self.cardBack?.cardCVV
                self.cardFront?.cardCVV.text = "•••"
                self.cardFront?.cardCVV.alpha = 0
                self.cardBack?.cardCVV.alpha = 1
            })
        } else {
            cvvLabel = cardFront?.cardCVV
            cardBack?.cardCVV.text = "••••"
            cardBack?.cardCVV.alpha = 0
            cardFront?.cardCVV.alpha = 1
        }

        editingLabel = cvvLabel
        textBox.resignFirstResponder()
        textBox.keyboardType = UIKeyboardType.numberPad
        textBox.becomeFirstResponder()
        textBox.text = self.viewModel.cvvEmpty  ?  "" : cvvLabel!.text!.replacingOccurrences(of: "•", with: "")
        textBox.placeholder = getTextboxPlaceholder()
        self.trackScreen()
    }

    /* Metodos para validar si un texto ingresado es valido, dependiendo del tipo
     de campo que se este llenando */

    func validateInput(_ textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {

        switch editingLabel! {
        case cardNumberLabel! :
            if !string.isNumber {
                return false
            }

            if string.count == 0 {
                return true
            }
            if ((textEditMaskFormater.textUnmasked(textField.text).count) == 6) && (string.count > 0) {
                if !viewModel.hasGuessedPM() {
                    return false
                }
            } else {

                if (textEditMaskFormater.textUnmasked(textField.text).count) == viewModel.getGuessedPM()?.cardNumberLenght() {
                    return false
                }
            }
            return true

        case nameLabel! : return validInputName(textField.text! + string)

        case expirationDateLabel! :
            if !string.isNumber {
                return false
            }
            return validInputDate(textField, shouldChangeCharactersInRange: range, replacementString: string)
        case cvvLabel! :
            if !string.isNumber {
                return false
            }
            return self.viewModel.isValidInputCVV(textField.text! + string)
        default : return false
        }
    }

    func validInputName(_ text: String) -> Bool {
        return true
    }
    func validInputDate(_ textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        //Range.Lenth will greater than 0 if user is deleting text - Allow it to replce
        if range.length > 0 {
            return true
        }

        //Dont allow empty strings and unwanted forward slash
        if string == " " || string == "/" {
            return false
        }

        //Check for max length including the spacers we added
        if range.location == 5 {
            return false
        }

        var originalText = textField.text
        let replacementText = string.replacingOccurrences(of: "/", with: "")

        //Verify entered text is a numeric value
        let digits = CharacterSet.decimalDigits
        for char in replacementText.unicodeScalars {
            if !digits.contains(UnicodeScalar(char.value)!) {
                return false
            }
        }

        if originalText!.count == 2 {
            originalText?.append("/")
            textField.text = originalText
        }

        return true
    }

    func setupInputAccessoryView() {
        if viewModel.shoudShowOnlyOneCardMessage() && self.editingLabel == self.cardNumberLabel {
            showOnlyOneCardMessage()
        } else {
            setupToolbarButtons()
        }
    }

    func setupToolbarButtons() {

        if self.toolbar == nil {
            let frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: 44)

            let toolbar = PXToolbar(frame: frame)

            toolbar.barStyle = UIBarStyle.default
            toolbar.isUserInteractionEnabled = true

            let buttonNext = UIBarButtonItem(title: "Continuar".localized, style: .plain, target: self, action: #selector(CardFormViewController.rightArrowKeyTapped))
            let buttonPrev = UIBarButtonItem(title: "card_form_previous_button".localized, style: .plain, target: self, action: #selector(CardFormViewController.leftArrowKeyTapped))

            let flexibleSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)

            toolbar.items = [buttonPrev, flexibleSpace, buttonNext]
            if self.viewModel.customerCard != nil || self.viewModel.token != nil {
                navItem!.leftBarButtonItem?.isEnabled = false
            }

            textBox.delegate = self
            self.toolbar = toolbar
        }
        textBox.inputAccessoryView = self.toolbar
    }

    func setOnlyOneCardMessage(message: String, color: UIColor, isError: Bool) {
        let frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: 44)
        let onlyOnePaymentMethodLabel = MPCardFormToolbarLabel(frame: frame)
        onlyOnePaymentMethodLabel.backgroundColor = color
        onlyOnePaymentMethodLabel.textColor = UIColor.white
        onlyOnePaymentMethodLabel.text = message
        onlyOnePaymentMethodLabel.font = Utils.getLightFont(size: 14)
        setTextBox(isError: isError, inputAccessoryView: onlyOnePaymentMethodLabel)
    }

    func showOnlyOneCardMessage() {
        if viewModel.shoudShowOnlyOneCardMessage() {
            setOnlyOneCardMessage(message: viewModel.getOnlyOneCardAvailableMessage(), color: UIColor.UIColorFromRGB(0x333333), isError: false)
        }
    }

    func showCardNotSupportedErrorMessage() {
        let paymentMethods = self.viewModel.paymentMethods

        if viewModel.shoudShowOnlyOneCardMessage() {
            setOnlyOneCardMessage(message: self.viewModel.getOnlyOneCardAvailableMessage(), color: UIColor.UIColorFromRGB(0xF04449), isError: true)
            trackError(errorMessage: self.viewModel.getOnlyOneCardAvailableMessage())
        } else {
            let cardNotAvailableError = CardNotAvailableErrorView(frame: (toolbar?.frame)!, paymentMethods: paymentMethods, showAvaibleCardsCallback: {
                self.editingLabel?.text = ""
                self.textBox.text = ""
                self.hideMessage()
                let availableCardsDetail = AvailableCardsViewController(paymentMethods: paymentMethods)
                self.navigationController?.present(availableCardsDetail, animated: true, completion: {})
            })
            setTextBox(isError: true, inputAccessoryView: cardNotAvailableError)
            trackError(errorMessage: "No puedes pagar con esta tarjeta".localized, style: Tracking.Style.snackbar)
        }
    }

    func setTextBox(isError: Bool, inputAccessoryView: UIView) {
        isShowingTextBoxMessage = true
        if isError {
            textBox.borderInactiveColor = ThemeManager.shared.rejectedColor()
            textBox.borderActiveColor = ThemeManager.shared.rejectedColor()
        }
        textBox.inputAccessoryView = inputAccessoryView
        textBox.setNeedsDisplay()
        textBox.resignFirstResponder()
        textBox.becomeFirstResponder()
    }

    func showMessage(_ errorMessage: String) {
        errorLabel = MPLabel(frame: toolbar!.frame)
        self.errorLabel!.backgroundColor = UIColor.UIColorFromRGB(0xEEEEEE)
        self.errorLabel!.textColor = ThemeManager.shared.rejectedColor()
        self.errorLabel!.text = errorMessage
        self.errorLabel!.textAlignment = .center
        self.errorLabel!.font = self.errorLabel!.font.withSize(12)
        setTextBox(isError: true, inputAccessoryView: errorLabel!)
        trackError(errorMessage: errorMessage)
    }

    func hideMessage() {
        isShowingTextBoxMessage = false
        self.textBox.borderInactiveColor = ThemeManager.shared.secondaryColor()
        self.textBox.borderActiveColor = ThemeManager.shared.secondaryColor()
        setupToolbarButtons()
        self.textBox.setNeedsDisplay()
        self.textBox.resignFirstResponder()
        self.textBox.becomeFirstResponder()
    }

    @objc func leftArrowKeyTapped() {
        trackBackEvent()
        switch editingLabel! {
        case cardNumberLabel! :
            return
        case nameLabel! :
            self.prepareNumberLabelForEdit()
        case expirationDateLabel! :
            prepareNameLabelForEdit()

        case cvvLabel! :
            if (self.viewModel.getGuessedPM()?.secCodeInBack())! {
                showFrontCardSideIfNeeded(duration: self.viewModel.animationDuration)
            }

            prepareExpirationLabelForEdit()
        default : self.updateLabelsFontColors()
        }
        self.updateLabelsFontColors()
    }

    @objc func reset() {
        if (self.viewModel.getGuessedPM()?.secCodeInBack())! {
            showFrontCardSideIfNeeded(duration: 0)
        }
        self.cardNumberLabel?.clearText()
        self.expirationDateLabel?.clearText()
        self.cvvLabel?.clearText()
        self.nameLabel?.clearText()
        self.clearCardSkin()
        self.prepareNumberLabelForEdit()
    }

    @objc func rightArrowKeyTapped() {
        switch editingLabel! {

        case cardNumberLabel! :
            if !validateCardNumber() {
                if viewModel.guessedPMS != nil {
                    showMessage((viewModel.cardToken?.validateCardNumber(viewModel.getGuessedPM()!))!)
                } else {
                    if cardNumberLabel?.text?.count == 0 {
                        showMessage("Ingresa el número de la tarjeta de crédito".localized)
                    } else {
                        showMessage("invalid_field".localized)
                    }
                }
                return
            }
            prepareNameLabelForEdit()

        case nameLabel! :
            if !self.validateCardholderName() {
                showMessage("Ingresa el nombre y apellido impreso en la tarjeta".localized)

                return
            }
            prepareExpirationLabelForEdit()

        case expirationDateLabel! :

            if viewModel.guessedPMS != nil {
                let bin = self.viewModel.getBIN(self.cardNumberLabel!.text!)
                if !(viewModel.getGuessedPM()?.isSecurityCodeRequired((bin)!))! {
                    self.confirmPaymentMethod()
                    return
                }
            }
            if !self.validateExpirationDate() {
                showMessage((viewModel.cardToken?.validateExpiryDate())!)
                return
            }
            self.prepareCVVLabelForEdit()

        case cvvLabel! :
            if !self.validateCvv() {

                showMessage(("invalid_cvv_length".localized as NSString).replacingOccurrences(of: "{0}", with: ((viewModel.getGuessedPM()?.secCodeLenght())! as NSNumber).stringValue))
                return
            }
            self.confirmPaymentMethod()
        default : updateLabelsFontColors()
        }
        updateLabelsFontColors()
    }

    func closeKeyboard() {
        textBox.resignFirstResponder()
        delightedLabels()
    }

    func clearCardSkin() {
        if self.cardFront?.cardLogo.image != nil, self.cardFront?.cardLogo.image != ResourceManager.shared.getCardDefaultLogo() {
            self.cardFront?.cardLogo.alpha = 0
            self.cardFront?.cardLogo.image = ResourceManager.shared.getCardDefaultLogo()
            UIView.animate(withDuration: 0.7, animations: { [weak self] in
                guard let self = self else { return }
                self.cardView.backgroundColor = UIColor.cardDefaultColor()
                self.cardFront?.cardLogo.alpha = 1
            })
        } else if self.cardFront?.cardLogo.image == nil {
            self.cardFront?.cardLogo.image = ResourceManager.shared.getCardDefaultLogo()
            self.cardView.backgroundColor = UIColor.cardDefaultColor()
        }

        let textMaskFormaterAux = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX")
        let textEditMaskFormaterAux = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX", completeEmptySpaces: false)

        cardNumberLabel?.text = textMaskFormaterAux.textMasked(textMaskFormater.textUnmasked(cardNumberLabel!.text))
        if editingLabel == cardNumberLabel {
            textBox.text = textEditMaskFormaterAux.textMasked(textEditMaskFormater.textUnmasked(textBox.text))
        }
        textEditMaskFormater = textMaskFormaterAux
        textEditMaskFormater = textEditMaskFormaterAux
        cardFront?.cardCVV.alpha = 0
        viewModel.guessedPMS = nil
        self.updateLabelsFontColors()
    }

    func updateCardSkin() {
        guard viewModel.getBIN(self.cardNumberLabel!.text!) != nil else {
            viewModel.guessedPMS = nil
            viewModel.cardToken = nil
            self.clearCardSkin()
            return
        }
        if textEditMaskFormater.textUnmasked(textBox.text).count >= 6 || viewModel.customerCard != nil ||
            viewModel.cardToken != nil {
            if isShowingTextBoxMessage {
                hideMessage()
            }
            let pmMatched = self.viewModel.matchedPaymentMethod(self.cardNumberLabel!.text!)
            viewModel.guessedPMS = pmMatched
            let bin = viewModel.getBIN(self.cardNumberLabel!.text!)
            if let paymentMethod = viewModel.getGuessedPM() {

                if self.cardFront?.cardLogo.image == ResourceManager.shared.getCardDefaultLogo() {
                    self.cardFront?.cardLogo.alpha = 0
                    self.cardFront?.cardLogo.image = paymentMethod.getImage()
                    UIView.animate(withDuration: 0.7, animations: { [weak self] in
                        guard let self = self else { return }
                        self.cardView.backgroundColor = (paymentMethod.getColor(bin: bin))
                        self.cardFront?.cardLogo.alpha = 1
                    })
                } else if self.cardFront?.cardLogo.image == nil {
                    self.cardFront?.cardLogo.image = paymentMethod.getImage()
                    self.cardView.backgroundColor = (paymentMethod.getColor(bin: bin))
                }
                let labelMask = paymentMethod.getLabelMask(bin: bin)
                let editTextMask = paymentMethod.getEditTextMask(bin: bin)
                let textMaskFormaterAux = TextMaskFormater(mask: labelMask)
                let textEditMaskFormaterAux = TextMaskFormater(mask: editTextMask, completeEmptySpaces: false)
                cardNumberLabel?.text = textMaskFormaterAux.textMasked(textMaskFormater.textUnmasked(cardNumberLabel!.text))
                if editingLabel == cardNumberLabel {
                    textBox.text = textEditMaskFormaterAux.textMasked(textEditMaskFormater.textUnmasked(textBox.text))
                }
                if editingLabel == cvvLabel {
                    editingLabel!.text = textBox.text
                    cvvLabel!.text = textBox.text
                }
                textMaskFormater = textMaskFormaterAux
                textEditMaskFormater = textEditMaskFormaterAux
            } else {
                self.clearCardSkin()
                showCardNotSupportedErrorMessage()
                return
            }

        }
        if self.cvvLabel == nil || self.cvvLabel!.text!.count == 0 {
            if (viewModel.guessedPMS != nil) && (!(viewModel.getGuessedPM()?.secCodeInBack())!) {
                cvvLabel = cardFront?.cardCVV
                cardBack?.cardCVV.text = ""
                cardFront?.cardCVV.alpha = 1
                cardFront?.cardCVV.text = "••••".localized
                self.viewModel.cvvEmpty = true
            } else {
                cvvLabel = cardBack?.cardCVV
                cardFront?.cardCVV.text = ""
                cardFront?.cardCVV.alpha = 0
                cardBack?.cardCVV.text = "•••".localized
                self.viewModel.cvvEmpty = true
            }
        }

        self.updateLabelsFontColors()
    }

    func delightedLabels() {
        cardNumberLabel?.textColor = self.viewModel.getLabelTextColor(cardNumber: cardNumberLabel?.text)
        nameLabel?.textColor = self.viewModel.getLabelTextColor(cardNumber: cardNumberLabel?.text)
        expirationDateLabel?.textColor = self.viewModel.getLabelTextColor(cardNumber: cardNumberLabel?.text)
        cvvLabel?.textColor = MPLabel.defaultColorText
        cardNumberLabel?.alpha = 0.7
        nameLabel?.alpha = 0.7
        expirationDateLabel?.alpha = 0.7
        cvvLabel?.alpha = 0.7
    }

    func lightEditingLabel() {
        if editingLabel != cvvLabel {
            editingLabel?.textColor = self.viewModel.getEditingLabelColor(cardNumber: cardNumberLabel?.text)
        }
        editingLabel?.alpha = 1
    }

    func updateLabelsFontColors() {
        self.delightedLabels()
        self.lightEditingLabel()
    }

    func markErrorLabel(_ label: UILabel) {
        label.textColor = MPLabel.errorColorText
    }

    fileprivate func createSavedCardToken() -> PXCardToken {
        let securityCode = self.viewModel.customerCard!.isSecurityCodeRequired() ? self.cvvLabel?.text : nil
        return  PXSavedCardToken(card: viewModel.customerCard!, securityCode: securityCode, securityCodeRequired: self.viewModel.customerCard!.isSecurityCodeRequired())
    }

    fileprivate func getTextboxPlaceholder() -> String {
        if editingLabel == cardNumberLabel {
            return "Número de tarjeta".localized
        } else if editingLabel == nameLabel {
            return "Nombre y apellido".localized
        } else if editingLabel == expirationDateLabel {
            return "Fecha de expiración".localized
        } else if editingLabel == cvvLabel {
            return "security_code".localized
        }
        return ""
    }

    func makeToken() {
        if viewModel.token != nil { // C4A
            let ct = PXCardToken()
            ct.securityCode = cvvLabel?.text
            self.callback!(viewModel.guessedPMS!, ct)
            return
        }

        if viewModel.customerCard != nil {
            _ = self.viewModel.buildSavedCardToken(self.cvvLabel!.text!)
            if !viewModel.cardToken!.validate() {
                markErrorLabel(cvvLabel!)
            }
        } else if self.viewModel.token != nil { // C4A
            let ct = PXCardToken()
            ct.securityCode = cvvLabel?.text
            self.callback!(viewModel.guessedPMS!, ct)
            return
        } else {
            self.viewModel.tokenHidratate(cardNumberLabel!.text!, expirationDate: self.expirationDateLabel!.text!, cvv: self.cvvLabel!.text!, cardholderName: self.nameLabel!.text!)

            if viewModel.guessedPMS != nil {
                let errorMethod = viewModel.cardToken!.validateCardNumber(viewModel.getGuessedPM()!)
                if (errorMethod) != nil {
                    markErrorLabel(cardNumberLabel!)
                    return
                }
            } else {

                markErrorLabel(cardNumberLabel!)
                return
            }

            let errorDate = viewModel.cardToken!.validateExpiryDate()
            if (errorDate) != nil {
                markErrorLabel(expirationDateLabel!)
                return
            }
            let errorName = viewModel.cardToken!.validateCardholderName()
            if (errorName) != nil {
                markErrorLabel(nameLabel!)
                return
            }
            let bin = self.viewModel.getBIN(self.cardNumberLabel!.text!)!
            if viewModel.getGuessedPM()!.isSecurityCodeRequired(bin) {
                let errorCVV = viewModel.cardToken!.validateSecurityCode()
                if (errorCVV) != nil {
                    markErrorLabel(cvvLabel!)
                    showFrontCardSideIfNeeded(duration: self.viewModel.animationDuration)
                    return
                }
            }
        }
        self.callback!(viewModel.guessedPMS!, self.viewModel.cardToken!)
    }

    func showFrontCardSideIfNeeded(duration: Double) {
        //sanity check: the card will not be flipped if the front side is already visible
        if self.displayCardState == .frontSide {
            return
        }
        self.displayCardState = .frontSide
        self.flip(visibleSide: .frontSide, duration: duration)
    }

    func showBackCardSideIfNeeded(completion: CompletionHandler?) {
        //sanity check: the card will not be flipped if the back side is already visible
        if self.displayCardState == .backSide {
            return
        }
        self.displayCardState = .backSide
        self.flip(visibleSide: .backSide,
                  duration: self.viewModel.animationDuration,
                  completion: completion)
    }

    func flip(visibleSide: DisplayCardState, duration: Double, completion: CompletionHandler? = nil) {
        //all animations must be executed on main thread
        DispatchQueue.main.async {
            let transitionOptions: UIView.AnimationOptions = [.transitionFlipFromLeft, .showHideTransitionViews]
            UIView.transition(with: self.cardView, duration: duration, options: transitionOptions, animations: {
                self.cardBack?.isHidden = (visibleSide == .frontSide)
                self.cardFront?.isHidden = (visibleSide == .backSide)
            }, completion: { (_) in
                if let completionBlock = completion {
                    completionBlock()
                }
            })
        }
    }

    func addCvvDot() -> Bool {
        let label = self.cvvLabel
        //Check for max length including the spacers we added
        if label?.text?.count == viewModel.cvvLenght() {
            return false
        }
        label?.text?.append("•")
        return true
    }

    func completeCvvLabel() {
        if (cvvLabel!.text?.replacingOccurrences(of: "•", with: "").count == 0) {
            cvvLabel?.text = cvvLabel?.text?.replacingOccurrences(of: "•", with: "")
            self.viewModel.cvvEmpty = true
        } else {
            self.viewModel.cvvEmpty = false
        }
        while addCvvDot() != false {
        }
    }

    func confirmPaymentMethod() {
        self.textBox.resignFirstResponder()
        makeToken()
    }

    internal func validateCardNumber() -> Bool {
        return self.viewModel.validateCardNumber(self.cardNumberLabel!, expirationDateLabel: self.expirationDateLabel!, cvvLabel: self.cvvLabel!, cardholderNameLabel: self.nameLabel!)
    }

    internal func validateCardholderName() -> Bool {
        return self.viewModel.validateCardholderName(self.cardNumberLabel!, expirationDateLabel: self.expirationDateLabel!, cvvLabel: self.cvvLabel!, cardholderNameLabel: self.nameLabel!)
    }

    internal func validateCvv() -> Bool {
        return self.viewModel.validateCvv(self.cardNumberLabel!, expirationDateLabel: self.expirationDateLabel!, cvvLabel: self.cvvLabel!, cardholderNameLabel: self.nameLabel!)
    }

    internal func validateExpirationDate() -> Bool {
        return self.viewModel.validateExpirationDate(self.cardNumberLabel!, expirationDateLabel: self.expirationDateLabel!, cvvLabel: self.cvvLabel!, cardholderNameLabel: self.nameLabel!)
    }

}
