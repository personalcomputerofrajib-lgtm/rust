package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

// QuantumGuard API - Phase 2 Expansion

type SystemStatus struct {
	OS          string `json:"os"`
	ScannerReady bool   `json:"scanner_ready"`
	NativeReady  bool   `json:"native_ready"`
	DBStatus     string `json:"db_status"`
}

type NetConn struct {
	Local  string `json:"local"`
	Remote string `json:"remote"`
	State  string `json:"state"`
	PID    int    `json:"pid"`
}

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./quantumguard.db")
	if err != nil {
		log.Fatal(err)
	}

	sqlStmt := `
	CREATE TABLE IF NOT EXISTS telemetry (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		cpu_usage REAL,
		mem_usage INTEGER,
		threat_level TEXT
	);
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Printf("%q: %s\n", err, sqlStmt)
	}
}

func main() {
	initDB()
	r := gin.Default()

	// CORS Setup
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	r.GET("/status", func(c *gin.Context) {
		c.JSON(200, SystemStatus{
			OS:          runtime.GOOS,
			ScannerReady: true,
			NativeReady:  true,
			DBStatus:     "Connected",
		})
	})

	// New Network Monitoring Endpoint
	r.GET("/network", func(c *gin.Context) {
		// In a real scenario, this would parse output from qg-native
		connections := []NetConn{
			{"127.0.0.1:8080", "127.0.0.1:54321", "ESTABLISHED", 4096},
			{"192.168.1.15:443", "52.12.34.56:443", "ESTABLISHED", 1024},
		}
		c.JSON(200, connections)
	})

	r.GET("/processes", func(c *gin.Context) {
		processes := []gin.H{
			{"id": 1024, "name": "System", "memory": 20480},
			{"id": 4096, "name": "QuantumGuard.exe", "memory": 150000},
		}
		c.JSON(200, processes)
	})

	// Log a sample telemetry data point every minute (simulated)
	go func() {
		for {
			_, err := db.Exec("INSERT INTO telemetry (cpu_usage, mem_usage, threat_level) VALUES (?, ?, ?)", 12.5, 450, "LOW")
			if err != nil {
				log.Println("DB Log Error:", err)
			}
			time.Sleep(60 * time.Second)
		}
	}()

	fmt.Println("QuantumGuard API v2.0 running on http://localhost:8080")
	r.Run(":8080")
}
