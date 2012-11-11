module Base64Helper
  def base64_url_decode(ciphertext)
    cipher_token = ciphertext.tr('-_','+/').unpack('m')[0]
  end
end
