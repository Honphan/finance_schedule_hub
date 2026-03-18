package com.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Mở CORS cho toàn bộ các API (tất cả các đường dẫn)
                .allowedOrigins("http://localhost:5173") // Chỉ đích danh địa chỉ của Vite Frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các method được phép đi qua
                .allowedHeaders("*") // Cho phép tất cả các loại Header
                .allowCredentials(true); // Cho phép đính kèm cookie hoặc thông tin xác thực nếu có
    }
}
