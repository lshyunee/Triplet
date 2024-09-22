package com.ssafy.triplet.config;

import com.ssafy.triplet.auth.jwt.*;
import com.ssafy.triplet.auth.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final CustomAuthenticationProvider customAuthenticationProvider;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtUtil jwtUtil;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http // cors 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource));
        http // form 로그인 disable
                .formLogin(form -> form.disable());
        http // 기존 logout disable
                .logout(logout -> logout.disable());
        http // csrf disable
                .csrf(csrf -> csrf.disable());
        http // http Basic 인증방식 disable
                .httpBasic(httpBasic -> httpBasic.disable());

        http // 소셜 로그인
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorizationEndpointConfig -> authorizationEndpointConfig
                                .baseUri("/api/v1/oauth2/authorization"))
                        .userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler));

        http // 경로별 인가 작업
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/error", "/api/v1/login", "/api/v1/signup",
                                "/api/v1/reissue", "/api/v1/sms/**").permitAll()
                        .anyRequest().hasRole("USER")
                );

        http // user not found, invalid password 를 구분하도록 커스텀한 provider 등록
                .authenticationProvider(customAuthenticationProvider);

        http // JwtFilter 를 커스텀한 LoginFilter 앞에 등록
                .addFilterBefore(new JwtFilter(jwtUtil), LoginFilter.class);
        http // 커스텀한 LoginFilter 를 기존의 UsernamePasswordAuthFilter 자리에 등록
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil) {{
                    setFilterProcessesUrl("/api/v1/login");}}, UsernamePasswordAuthenticationFilter.class);
        http // 커스텀한 CustomLogoutFilter 를 기존의 LogoutFilter 앞에 등록
                .addFilterAt(new CustomLogoutFilter(jwtUtil), LogoutFilter.class);
        http // 세션 stateless 로 설정 -> jwt
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

}
