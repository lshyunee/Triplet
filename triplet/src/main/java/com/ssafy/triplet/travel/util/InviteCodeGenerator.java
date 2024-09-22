package com.ssafy.triplet.travel.util;

import java.util.Random;

public class InviteCodeGenerator {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;

    public static String generateInviteCode() {
        Random random = new Random();
        StringBuilder inviteCode = new StringBuilder(CODE_LENGTH);

        for (int i = 0; i < CODE_LENGTH; i++) {
            inviteCode.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return inviteCode.toString();
    }
}
